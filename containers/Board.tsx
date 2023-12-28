import { useEffect, useState, useCallback } from "react";
import SuccessMessage from "../components/SuccessMessage";
import { SPRINT_GAME_CONTRACT, LEADERBOARD_CONTRACT } from '../lib/constants';
import { ethos, TransactionBlock } from 'ethos-connect'

function Board() {
  const { wallet } = ethos.useWallet();
  const [game_status, setStatus] = useState< 0 | 1 | 2>(0);
  const [curr_game, setCurrGame] = useState("");

  const reset = useCallback(() => {
    setCurrGame("");
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
          setCurrGame(createObjectChange.objectId);
        }
      }  
      console.log(`Game started! ${curr_game}`);
      setStatus(1);
    } catch (error) {
      console.log(error);
    }
    //return curr_game;

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
        {/* setStatus(2);
        await submit(); */}
        setStatus(0);
        setCurrGame("");
      } 
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }, [wallet]);

  const submit = useCallback(async () => {
    if (!wallet) return;

    try {
      const submitTx = new TransactionBlock();
      const submittedGame = submitTx.moveCall({
        target: `${SPRINT_GAME_CONTRACT}::leaderboard::submit_game`,
        arguments: [
          submitTx.pure(curr_game),  
          submitTx.pure(LEADERBOARD_CONTRACT)      
        ]
      })

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: submitTx,
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
      {/* {game_status == 1 && <p>Submit game to leaderboard?</p>}*/}
      <button className="start" onClick={start}>
        Start
      </button>
      <button className="end" onClick={end}>
        End
      </button>
      {curr_game != "" && (
        <SuccessMessage reset={reset}>
          <a 
            href={`https://explorer.sui.io/objects/${curr_game}?network=mainnet`}
            target="_blank" 
            rel="noreferrer"
            className='underline font-blue-600' 
          >
            View Your Game on Sui Explorer 
          </a>
        </SuccessMessage>
      )}
    </div>
  );
}

export default Board;