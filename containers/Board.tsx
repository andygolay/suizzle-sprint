import { useEffect, useState, useCallback } from "react";
import Square from "../components/Square";
import { SPRINT_GAME_CONTRACT } from '../lib/constants';
import { ethos, TransactionBlock } from 'ethos-connect'
import { SuiCallArg, SuiObjectChange } from "@mysten/sui.js/dist/cjs/client";
type Player = "X" | "O" | "BOTH" | null;


function Board() {
  const { wallet } = ethos.useWallet();
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [game_status, setStatus] = useState< 0 | 1 >(0);
  let curr_game = "none_yet";

  const start = useCallback(async () => {
    if (!wallet) return;

    try {
      const startTx = new TransactionBlock();
      const createdGame = startTx.moveCall({
        target: `${SPRINT_GAME_CONTRACT}::suizzle_sprint::create_game`,
        arguments: [
          startTx.pure("0x6"),        
        ]
      })

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: startTx,
        options: {
          showObjectChanges: true,
        }
      });
      
      if (response.objectChanges) {
        const createObjectChange = response.objectChanges.find(
            (objectChange) => objectChange.type === "created"
        );
        if (!!createObjectChange && "objectId" in createObjectChange) {
          curr_game = createObjectChange.objectId;
        }
      }  
      setStatus(1);
    } catch (error) {
      console.log(error);
    }
    return curr_game;
  }, [wallet]);


  const end = useCallback(async () => {
    if (!wallet) return;

    try {
      const endTx = new TransactionBlock();
      const endedGame = endTx.moveCall({
        target: `${SPRINT_GAME_CONTRACT}::suizzle_sprint::end_game`,
        arguments: [
          endTx.pure("0x6"),  
          endTx.pure(curr_game)      
        ]
      })

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: endTx,
        options: {
          showObjectChanges: true,
        }
      });
      
      if (response.objectChanges) {
        const createObjectChange = response.objectChanges.find(
            (objectChange) => objectChange.type === "created"
        );

      } 
      console.log(response);
      setStatus(1);
    } catch (error) {
      console.log(error);
    }
  }, [wallet]);

  useEffect(() => {
      
    
  });

  return (
    <div>
      {game_status == 0 && <p>Start the game now!</p>}
      {game_status == 1 && <p>End the game fast!</p>}

      <button className="start" onClick={start}>
        Start
      </button>
      <button className="end" onClick={end}>
        End
      </button>
    </div>
  );
}

export default Board;