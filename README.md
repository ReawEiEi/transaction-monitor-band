# transaction-monitor-band

Transaction Client Module Documentation

## Overview

The TransactionClient is a JavaScript module designed to interact with an HTTP server for broadcasting transactions and monitoring their statuses until finalization. This module is intended for integration into larger applications, enabling seamless transaction management.

## Features

1. Broadcast Transaction: Send transaction data to the server.

2. Monitor Transaction: Check the status of a transaction periodically until it is finalized.

3. Command-Line Interaction: Users can broadcast transactions and monitor them via CLI.

## Module Setup

1. Dependencies

   Ensure you are using `Node.js`. No external libraries are required, as it utilizes built-in modules:

   - readline for CLI interaction

   - fetch (ensure `Node.js` `v18+` or install `node-fetch` for OLDER versions)

2. Installation

   Use `node transaction-client.js` to run the module.

## Class: TransactionClient

### Constructor

`new TransactionClient(baseURL)`

- **baseUR**L (optional): The server's base URL. Defaults to https://mock-node-wgqbnxruha-as.a.run.app.

### Methods

1. broadcastTransaction(symbol, price, timestamp)

   Broadcasts a transaction to the server.

   **Parameters:**

   - symbol (string): The transaction symbol (e.g., BTC, ETH).

   - price (number): The price of the symbol.

   - timestamp (number): The current timestamp.

   **Returns:**

   - tx_hash (string): Transaction hash received from the server.

2. checkTransactionStatus(txHash)

   Checks the status of a transaction using its hash.

   **Parameters:**

   - txHash (string): The transaction hash.

   **Returns:**

   - tx_status (string): Status can be CONFIRMED, FAILED, PENDING, or DNE.

3. monitorTransaction(txHash, interval = 5000)

   Periodically checks the status of the transaction until it is finalized.

   **Parameters:**

   - txHash (string): Transaction hash.

   - interval (number): Polling interval in milliseconds (default: 5000ms).

   **Returns:**

   - Final transaction status (CONFIRMED, FAILED, or DNE).

## Example Script

```(async () => {
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
```

## Handling Transaction Status

**- CONFIRMED**

- The transaction is successfully processed. The monitoring stops automatically.

**- FAILED**

- The transaction failed. The monitoring stops automatically, and the error is logged.

**- PENDING**

- The transaction is still being processed. The system will continue to check at regular intervals.

**- DNE (Does Not Exist)**

- The transaction hash is invalid or not found. The monitoring stops automatically.

## Strategies for Status Handling

**Efficient Polling:**

- Uses setInterval for periodic checks without blocking the main thread.

**Graceful Termination:**

- Automatically stops polling when a final status (CONFIRMED, FAILED, DNE) is reached.

**Error Handling:**

- Catches and logs network or API errors gracefully.

## Troubleshooting

- **Network Errors:** Ensure you're connected to the internet and the API endpoint is available.

- **Invalid Inputs:** Validate inputs before broadcasting.

- **Unexpected Crashes:** Check the console logs for stack traces and error messages.
