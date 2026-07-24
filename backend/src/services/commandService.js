const { PrismaClient } = require('@prisma/client');
const { Rcon } = require('rcon-client');
const { decrypt } = require('../utils/encryption');
const prisma = new PrismaClient();

class CommandService {
  constructor() {
    // Fallback env vars for backward compatibility
    this.envRconHost = process.env.RCON_HOST || 'localhost';
    this.envRconPort = parseInt(process.env.RCON_PORT) || 25575;
    this.envRconPassword = process.env.RCON_PASSWORD || '';
    this.envRconTimeout = 10000;
  }

  // ---------------------------------------------------------------------------
  // RCON Config Resolution
  // ---------------------------------------------------------------------------

  /**
   * Fetch and decrypt the RCON config for a serverType from DB.
   * Falls back to env vars if no DB config exists.
   */
  async getRconConfig(serverTypeId) {
    if (serverTypeId) {
      const config = await prisma.rconConfig.findUnique({
        where: { serverTypeId }
      });

      if (config && config.isActive) {
        let password;
        try {
          password = decrypt(config.passwordEncrypted);
        } catch (err) {
          console.error('[RCON] Failed to decrypt password for config', config.id, err.message);
          throw new Error('Failed to decrypt RCON password');
        }
        return { host: config.host, port: config.port, password, timeout: config.timeout };
      }
    }

    // Fallback to environment variables
    console.warn('[RCON] No active DB config found for serverTypeId', serverTypeId, '— using env vars');
    return {
      host: this.envRconHost,
      port: this.envRconPort,
      password: this.envRconPassword,
      timeout: this.envRconTimeout
    };
  }

  // ---------------------------------------------------------------------------
  // Connection
  // ---------------------------------------------------------------------------

  async connectRcon(serverTypeId = null) {
    const { host, port, password, timeout } = await this.getRconConfig(serverTypeId);
    try {
      console.log(`[RCON] Connecting to ${host}:${port}...`);
      const rcon = await Rcon.connect({ host, port, password, timeout });
      console.log('[RCON] Connected successfully');
      return rcon;
    } catch (error) {
      console.error('[RCON] Connection failed:', error.message);
      throw new Error(`Failed to connect to RCON: ${error.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Command Generation
  // ---------------------------------------------------------------------------

  /**
   * Substitute known variables in a command template string.
   * Supported: {player}, {amount}, {quantity}, {duration}, {groupName}, {permission}
   * Percent-wrapped aliases such as %player% and %amount% are also accepted.
   */
  interpolateCommand(template, vars) {
    return template
      .replace(/\{player\}|%player%/g, vars.player || '')
      .replace(/\{amount\}|%amount%/g, vars.amount ?? '')
      .replace(/\{quantity\}|%quantity%/g, vars.quantity ?? '')
      .replace(/\{duration\}|%duration%/g, vars.duration ?? '')
      .replace(/\{groupName\}|%groupName%/g, vars.groupName || '')
      .replace(/\{permission\}|%permission%/g, vars.permission || '');
  }

  /**
   * Generate an array of RCON commands for a product + player.
   * Uses product.commands (custom) first; falls back to hardcoded logic.
   * @returns {string[]}
   */
  generateCommands(product, minecraftName, quantity = 1) {
    const vars = {
      player: minecraftName,
      quantity,
      amount: product.amount * quantity,
      duration: product.amount * quantity,
      groupName: product.groupName || '',
      permission: product.permission || ''
    };

    // Custom commands take priority
    const customCommands = Array.isArray(product.commands)
      ? product.commands.filter(c => typeof c === 'string' && c.trim())
      : [];

    if (customCommands.length > 0) {
      return customCommands.map(cmd => this.interpolateCommand(cmd, vars));
    }

    // Hardcoded fallback per product type
    if (product.type === 'COIN') {
      return [`points give ${minecraftName} ${vars.amount}`];
    }
    if (product.type === 'MONEY') {
      return [`eco give ${minecraftName} ${vars.amount}`];
    }
    if (product.type === 'RANK') {
      return [`lp user ${minecraftName} parent addtemp ${product.groupName} ${vars.duration}d`];
    }
    if (product.type === 'FEATURE') {
      return [`lp user ${minecraftName} permission settemp ${product.permission} true ${vars.duration}d`];
    }

    return [];
  }

  // Keep old single-command method as alias for backward compat
  generateCommand(product, minecraftName, quantity = 1) {
    return this.generateCommands(product, minecraftName, quantity)[0] || null;
  }

  // ---------------------------------------------------------------------------
  // Command Execution
  // ---------------------------------------------------------------------------

  async executeCommand(command, serverTypeId = null) {
    const isDummyMode = process.env.DUMMY_MODE === 'true';

    if (isDummyMode) {
      console.log('[DUMMY MODE] Simulating command execution:', command);
      return {
        success: true,
        message: `[DUMMY MODE] Command simulated: ${command}`,
        output: `[DUMMY] Executed: ${command}`
      };
    }

    let rcon;
    try {
      console.log('[RCON] Executing command:', command);
      rcon = await this.connectRcon(serverTypeId);
      const response = await rcon.send(command);
      console.log('[RCON] Command response:', response || '(empty response)');
      await rcon.end();
      console.log('[RCON] Connection closed');
      return { success: true, message: response || 'Command executed successfully', output: response };
    } catch (error) {
      console.error('[RCON] Failed to execute command:', error.message);
      if (rcon) {
        try { await rcon.end(); } catch (_) {}
      }
      return { success: false, error: error.message, output: null };
    }
  }

  // ---------------------------------------------------------------------------
  // Order Execution
  // ---------------------------------------------------------------------------

  async executeOrderCommands(orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      if (!order) throw new Error('Order not found');

      console.log(`[ORDER] Executing commands for order ${order.orderCode}`);
      const results = [];
      let allSuccess = true;

      for (const item of order.items) {
        const commands = this.generateCommands(item.product, order.minecraftName, item.quantity);

        if (commands.length === 0) {
          console.warn(`[ORDER] No commands generated for product ${item.product.name}`);
          continue;
        }

        for (const command of commands) {
          const result = await this.executeCommand(command, order.serverTypeId);

          const logEntry = {
            productId: item.productId,
            productName: item.product.name,
            command,
            success: result.success,
            output: result.output || result.message,
            error: result.error
          };

          results.push(logEntry);
          if (!result.success) allSuccess = false;

          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: allSuccess ? 'COMPLETED' : 'PAID' 
        }
      });

      console.log(`[ORDER] ${order.orderCode} execution summary:`);
      console.log(JSON.stringify(results, null, 2));
      
      if (allSuccess) {
        console.log(`[ORDER] ✓ All commands executed successfully for ${order.orderCode}`);
      } else {
        console.log(`[ORDER] ⚠ Some commands failed for ${order.orderCode}`);
      }
      
      return results;
    } catch (error) {
      console.error('[ORDER] Failed to execute commands:', error);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // Player Verification
  // ---------------------------------------------------------------------------

  async checkPlayerOnline(minecraftName, serverTypeId = null) {
    try {
      console.log(`[RCON] Checking if ${minecraftName} is online...`);
      const result = await this.executeCommand(`seen ${minecraftName}`, serverTypeId);

      if (result.success && result.output) {
        const output = result.output.toLowerCase();
        const isOnline = output.includes('is online') || 
                        output.includes('currently online') ||
                        output.includes('is currently online');
        
        console.log(`[RCON] Player ${minecraftName} online status:`, isOnline);
        
        return {
          success: true,
          online: isOnline,
          output: result.output
        };
      }

      return {
        success: false,
        online: false,
        error: result.error || 'Unknown error'
      };
    } catch (error) {
      console.error('[RCON] Failed to check player status:', error);
      return { 
        success: false, 
        online: false, 
        error: error.message 
      };
    }
  }

  async getPlayerInfo(minecraftName, serverTypeId = null) {
    try {
      console.log(`[RCON] Getting info for player ${minecraftName}...`);
      const result = await this.executeCommand(`lp user ${minecraftName} info`, serverTypeId);

      if (result.success && result.output) {
        const output = result.output.toLowerCase();
        const notFound = output.includes('not found') || 
                        output.includes('does not exist') ||
                        output.includes('is not loaded') ||
                        output.includes('unknown player');
        
        const exists = !notFound;
        console.log(`[RCON] Player ${minecraftName} exists in LuckPerms:`, exists);
        
        return {
          success: true,
          exists: exists,
          output: result.output
        };
      }

      return {
        success: false,
        exists: false,
        error: result.error || 'Command failed'
      };
    } catch (error) {
      console.error('[RCON] Failed to get player info:', error);
      return { 
        success: false, 
        exists: false, 
        error: error.message 
      };
    }
  }

  async verifyPlayerExists(minecraftName, serverTypeId = null) {
    try {
      console.log(`[VERIFY] Verifying player: ${minecraftName}`);

      const isDummyMode = process.env.DUMMY_MODE === 'true';
      
      if (isDummyMode) {
        console.log('[DUMMY MODE] Skipping RCON verification for:', minecraftName);
        return {
          success: true,
          exists: true,
          method: 'dummy',
          message: `[DUMMY MODE] Player ${minecraftName} verified without RCON`
        };
      }
      
      // Method 1: Try LuckPerms
      console.log('[VERIFY] Method 1: Checking via LuckPerms...');
      const lpResult = await this.getPlayerInfo(minecraftName, serverTypeId);
      
      if (lpResult.success) {
        if (lpResult.exists) {
          console.log(`[VERIFY] ✓ Player ${minecraftName} found via LuckPerms`);
          return {
            success: true,
            exists: true,
            method: 'luckperms',
            message: 'Player found in LuckPerms database',
            output: lpResult.output
          };
        } else {
          console.log(`[VERIFY] ✗ Player ${minecraftName} not found in LuckPerms`);
        }
      } else {
        console.log('[VERIFY] LuckPerms check failed:', lpResult.error);
      }

      // Method 2: Try seen command (Essentials)
      console.log('[VERIFY] Method 2: Checking via seen command...');
      const seenResult = await this.executeCommand(`seen ${minecraftName}`, serverTypeId);
      
      if (seenResult.success && seenResult.output) {
        const output = seenResult.output.toLowerCase();
        console.log('[VERIFY] Seen command output:', seenResult.output);
        
        const notFound = output.includes('never played') || 
                        output.includes('not found') || 
                        output.includes('unknown player') ||
                        output.includes('has never been on this server') ||
                        output.includes('player not found');
        
        if (!notFound) {
          console.log(`[VERIFY] ✓ Player ${minecraftName} found via seen command`);
          return {
            success: true,
            exists: true,
            method: 'seen',
            message: 'Player found in server records',
            lastSeen: seenResult.output
          };
        } else {
          console.log(`[VERIFY] ✗ Player ${minecraftName} never played on server`);
        }
      } else {
        console.log('[VERIFY] Seen command failed:', seenResult.error);
      }

      // Player not found by any method
      console.log(`[VERIFY] ✗ Player ${minecraftName} not found by any method`);
      return {
        success: true,
        exists: false,
        message: 'Player not found in server. Please join the server at least once.'
      };
    } catch (error) {
      console.error('[VERIFY] Error during verification:', error);
      return {
        success: false,
        exists: false,
        error: error.message
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Rank Check
  // ---------------------------------------------------------------------------

  /**
   * Run /rankcheck {player} via RCON and return the player's current rank name.
   * Returns { success: true, rank: "VIP" | null, method: string }
   */
  async getPlayerRank(minecraftName, serverTypeId = null) {
    try {
      const isDummyMode = process.env.DUMMY_MODE === 'true';

      if (isDummyMode) {
        console.log('[DUMMY MODE] Skipping rankcheck for:', minecraftName);
        return { success: true, rank: null, method: 'dummy' };
      }

      console.log(`[RCON] Checking rank for ${minecraftName}...`);
      const result = await this.executeCommand(`rankcheck ${minecraftName}`, serverTypeId);

      if (result.success && result.output) {
        const output = result.output.trim();
        // rankcheck returns the rank name directly; empty / error phrases = no rank
        if (
          output &&
          !output.toLowerCase().includes('not found') &&
          !output.toLowerCase().includes('error') &&
          output.toLowerCase() !== 'default'
        ) {
          console.log(`[RCON] Player ${minecraftName} has rank: ${output}`);
          return { success: true, rank: output, method: 'rankcheck' };
        }
      }

      console.log(`[RCON] Player ${minecraftName} has no rank or default rank`);
      return { success: true, rank: null, method: 'rankcheck' };
    } catch (error) {
      console.error('[RCON] Failed to check player rank:', error);
      return { success: false, rank: null, error: error.message };
    }
  }

  async testConnection(serverTypeId = null) {
    try {
      const isDummyMode = process.env.DUMMY_MODE === 'true';
      if (isDummyMode) {
        return {
          success: true,
          message: '[DUMMY MODE] RCON connection simulated successfully',
          output: '[DUMMY] There are 0/20 players online',
          isDummy: true
        };
      }
      const result = await this.executeCommand('list', serverTypeId);
      return {
        success: result.success,
        message: result.success ? 'RCON connection successful' : 'RCON connection failed',
        output: result.output,
        error: result.error
      };
    } catch (error) {
      return { success: false, message: error.message, error: error.message };
    }
  }
}

module.exports = new CommandService();
