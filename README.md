# Sui Tac Toe

This is a [Next.js](https://nextjs.org/) app written with [TypeScript](https://www.typescriptlang.org/) implementing [EthosConnect](https://ethoswallet.xyz/dev), the easiest way to connect with any wallet on Sui.

Game contract address (Sui mainnet):

`0x97a76dc8b0f434061357e897bf25fb7d2b9a99c5752fec473c99f928d5bd4e1d`

The package contains three modules:

* `rock_paper_scissors`: the classic rock paper scissors game.
* `shared_tic_tac_toe`: tic tac toe with a shared object as the game.
* `tic_tac_toe`: tic tac toe using a server authority model.

---

## Important files in this repository

Here are the places in the code that implement EthosConnect:

### `_app.tsx`

The `EthosConnectProvider` wraps the whole app:

```js
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EthosConnectProvider>
      <Component {...pageProps} />
    </EthosConnectProvider>
  );
}
```

### `index.tsx`

This is the rest of the app. It embeds a `Board` container filled with 9 `Square` components.

The game logic mainly takes place in `containers/Board.tsx`.

### The Move Contract

You can publish the move contract using the following command:

`sui client publish --gas-budget <gas budget, 750000000 is working as of November 2023>`

### Running The Front End

`yarn install`

`npm run dev` 