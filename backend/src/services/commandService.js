const { PrismaClient } = require('@prisma/client');
const { Rcon } = require('rcon-client');
const prisma = new PrismaClient();

class CommandService {
  constructor() {
    this.rconHost = process.env.RCON_HOST || 'localhost';
    this.rconPort = parseInt(process.env.RCON_PORT) || 25566;
    this.rconPassword = process.env.RCON_PASSWORD || 'dikakimak19281';
    this.rconTimeout = 10000; // 10 seconds timeout
  }

  async connectRcon() {
    try {
      console.log(`[RCON] Connecting to ${this.rconHost}:${this.rconPort}...`);
      
      const rcon = await Rcon.connect({
        host: this.rconHost,
        port: this.rconPort,
        password: this.rconPassword,
        timeout: this.rconTimeout
      });
      
      console.log('[RCON] Connected successfully');
      return rcon;
    } catch (error) {
      console.error('[RCON] Connection failed:', error.message);
      throw new Error(`Failed to connect to RCON: ${error.message}`);
    }
  }

  generateCommand(product, minecraftName, quantity = 1) {
    if (product.type === 'COIN') {
      const totalAmount = product.amount * quantity;
      return `points give ${minecraftName} ${totalAmount}`;
    }

    if (product.type === 'RANK') {
      const duration = product.amount * quantity;
      return `lp user ${minecraftName} parent addtemp ${product.groupName} ${duration}d`;
    }

    return null;
  }

  async executeCommand(command) {
    let rcon;
    try {
      console.log('[RCON] Executing command:', command);
      
      rcon = await this.connectRcon();
      const response = await rcon.send(command);
      
      console.log('[RCON] Command response:', response || '(empty response)');
      
      await rcon.end();
      console.log('[RCON] Connection closed');
      
      return { 
        success: true, 
        message: response || 'Command executed successfully',
        output: response
      };
    } catch (error) {
      console.error('[RCON] Failed to execute command:', error.message);
      
      if (rcon) {
        try {
          await rcon.end();
        } catch (endError) {
          console.error('[RCON] Error closing connection:', endError);
        }
      }
      
      return { 
        success: false, 
        error: error.message,
        output: null
      };
    }
  }

  async executeOrderCommands(orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      console.log(`[ORDER] Executing commands for order ${order.orderCode}`);
      const results = [];
      let allSuccess = true;

      for (const item of order.items) {
        const command = this.generateCommand(item.product, order.minecraftName, item.quantity);
        
        if (command) {
          const result = await this.executeCommand(command);
          
          const logEntry = {
            productId: item.productId,
            productName: item.product.name,
            command,
            success: result.success,
            output: result.output || result.message,
            error: result.error
          };
          
          results.push(logEntry);
          if (!result.success) {
            allSuccess = false;
          }
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

  async checkPlayerOnline(minecraftName) {
    try {
      console.log(`[RCON] Checking if ${minecraftName} is online...`);
      const command = `seen ${minecraftName}`;
      const result = await this.executeCommand(command);

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

  async getPlayerInfo(minecraftName) {
    try {
      console.log(`[RCON] Getting info for player ${minecraftName}...`);
      const command = `lp user ${minecraftName} info`;
      const result = await this.executeCommand(command);

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

  async verifyPlayerExists(minecraftName) {
    try {
      console.log(`[VERIFY] Verifying player: ${minecraftName}`);
      
      // Method 1: Try LuckPerms
      console.log('[VERIFY] Method 1: Checking via LuckPerms...');
      const lpResult = await this.getPlayerInfo(minecraftName);
      
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
      const seenResult = await this.executeCommand(`seen ${minecraftName}`);
      
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

  async testConnection() {
    try {
      console.log('[TEST] Testing RCON connection...');
      const result = await this.executeCommand('list');
      return {
        success: result.success,
        message: result.success ? 'RCON connection successful' : 'RCON connection failed',
        output: result.output,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        message: 'RCON connection failed',
        error: error.message
      };
    }
  }
}

module.exports = new CommandService();
