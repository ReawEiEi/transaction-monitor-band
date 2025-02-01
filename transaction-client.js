// transactionClient.js

class TransactionClient {
  constructor(baseURL = "https://mock-node-wgqbnxruha-as.a.run.app") {
    this.baseURL = baseURL;
  }

  // Broadcast Transaction
  async broadcastTransaction(symbol, price, timestamp) {
    const payload = {
      symbol: symbol,
      price: price,
      timestamp: timestamp,
    };

    try {
      const response = await fetch(`${this.baseURL}/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.tx_hash;
    } catch (error) {
      console.error("Broadcast Transaction Error:", error);
      throw error;
    }
  }

  // Check Transaction Status
  async checkTransactionStatus(txHash) {
    try {
      const response = await fetch(`${this.baseURL}/check/${txHash}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.tx_status;
    } catch (error) {
      console.error("Check Transaction Status Error:", error);
      throw error;
    }
  }

  // Monitor Transaction Until Finalization
  async monitorTransaction(txHash, interval = 5000) {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const status = await this.checkTransactionStatus(txHash);
          console.log(`Transaction Status: ${status}`);

          if (
            status === "CONFIRMED" ||
            status === "FAILED" ||
            status === "DNE"
          ) {
            clearInterval(intervalId);
            resolve(status);
          }
        } catch (error) {
          clearInterval(intervalId);
          reject(error);
        }
      }, interval);
    });
  }
}

// Required Libraries for User Interaction
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt the user
const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

// Usage
(async () => {
  const client = new TransactionClient();

  while (true) {
    const command = await askQuestion(
      "Command:\n1. Broadcast Transaction\n2. Monitor Transaction\n3. Exit\nEnter Command: "
    );
    console.log("\n");

    if (command === "1") {
      const symbol = await askQuestion("Enter symbol (e.g., BTC, ETH): ");
      const price = parseInt(await askQuestion("Enter price: "));
      const timestamp = Date.now();

      try {
        const txHash = await client.broadcastTransaction(
          symbol,
          price,
          timestamp
        );
        console.log(`Transaction Broadcasted with Hash: ${txHash}`);
      } catch (error) {
        console.error("Broadcast Error:", error);
      }
    } else if (command === "2") {
      const txHash = await askQuestion("Enter Transaction Hash: ");

      try {
        const status = await client.monitorTransaction(txHash);
        console.log(`Transaction Final Status: ${status}`);
      } catch (error) {
        console.error("Monitoring Error:", error);
      }
    } else if (command === "3") {
      console.log("Exiting...");
      rl.close();
      break;
    } else {
      console.log("Invalid command. Please try again.");
    }
    console.log("\n");
  }
})();
