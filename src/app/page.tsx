"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
const gost = require("gost-crypto");
export default function Home() {
  const handleCrypto = async () => {
    console.log(gost);

    let key;

    await gost.subtle
      .generateKey("GOST R 34.10", true, ["sign", "verify"])
      .then(function (keyPair: any) {
        console.log(keyPair);
        // Store key in secluded place
        return gost.subtle
          .exportKey("raw", keyPair.privateKey)
          .then(async function (result: any) {
            console.log(result);
            console.log(
              "gost.coding.Hex.encode(result): ",
              gost.coding.Hex.encode(result)
            );

            key = keyPair.privateKey;
            // Provide the public key to recepient
            return gost.subtle
              .exportKey("raw", keyPair.publicKey)
              .then(async function (result: any) {
                console.log(
                  "gost.coding.Hex.encode(result): ",
                  gost.coding.Hex.encode(result)
                );
              });
          });
      })
      .catch(function (error: any) {
        console.log("error: ", error);
        console.log("error: ", error.stack);
        alert(error.message);
      });

    console.log(key);
    await gost.subtle.sign({ name: "GOST R 34.10" }, key, "abcde");
  };

  useEffect(() => {
    const myWorker = new Worker("gostEngineWorker.js");

    // Set up event listener for messages from the worker
    myWorker.onmessage = function (event) {
      console.log("Received result from worker:", event.data);
      console.log(event.data);
    };
  }, []);
  return (
    <main className={styles.main}>
      <button onClick={handleCrypto}>sign</button>
    </main>
  );
}
