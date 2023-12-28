import type { NextPage } from "next";
import { SignInButton, ethos } from "ethos-connect";
import { Disconnect, Fund, Mint, WalletActions } from "../components";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Board from "../containers/Board";

const Home: NextPage = () => {
  const { status, wallet } = ethos.useWallet();

  return (
    <div className="flex justify-between items-start styles.container">

      <Head>
        <title>Suizzle Sprint 🌊</title>
        <meta name="description" content="By Suizzle" />
        <link rel="icon" href="/suitactoe.png" />
      </Head>
      <div className="p-12 flex-1">Status: {status}</div>

      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex-6">
        {!wallet ? (
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl m-2">
              Welcome! Connect to play!
            </h1>
            <SignInButton className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 m-2">
              Connect
            </SignInButton>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Suizzle Sprint
              </h1>
            </div>
              <main className={styles.main}>  
                <Board />
              </main>

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              Thanks for playing. You can play more Suzzle Sprint ☝️ or
              <Disconnect />
            </div>
          </div>
        )}
      </div>

      <div id="address-widget" className="p-12 flex-1 flex justify-end">
        <ethos.components.AddressWidget 
          // excludeButtons={[
          //   ethos.enums.AddressWidgetButtons.WalletExplorer
          // ]} 
        />
      </div>
    </div>
  );
};

export default Home;
