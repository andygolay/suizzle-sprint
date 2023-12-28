import { useEffect, useState, useCallback } from "react";
import SuccessMessage from "../components/SuccessMessage";
import { SPRINT_GAME_CONTRACT } from '../lib/constants';
import { ethos, TransactionBlock } from 'ethos-connect'

function Leaderboard() {
  const { wallet } = ethos.useWallet();
  const [game_status, setStatus] = useState< 0 | 1 >(0);
  let curr_game = "notyet";

  const reset = useCallback(() => {

}, [])

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

  }, [wallet]);

  useEffect(() => {
      
    
  });

  return (
    <div>

      <button className="show-leaderboard" onClick={start}>
        Start
      </button>
      {/* TODO: Put a table here with the leaderboard. Address, game start time and duration. 
      First row of the table is the headings. 
      We want to pull the information from the games in the leaderboard.
      
      
      */}
      

    </div>
  );
}

export default Leaderboard;