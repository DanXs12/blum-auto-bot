require('dotenv').config();
require('colors');
const readlineSync = require('readline-sync');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const {
  getToken,
  getUsername,
  getBalance,
  getTribe,
  claimFarmReward,
  startFarmingSession,
  getTasks,
  claimTaskReward,
  getGameId,
  claimGamePoints,
  startTask,
  claimDailyReward,
} = require('./src/api.js');
const {
  // setupCronJob,
  // setupBalanceCheckJob,
  // setupDailyRewardCron,
  // setupFarmRewardCron,
} = require('./src/cronJobs');
const { delay } = require('./src/utils');
const { displayHeader } = require('./src/display');

const TOKEN_FILE_PATH = path.join(__dirname, 'accessToken.txt');

// const handleTasksForQueryID = async (queryId) => {
//   process.env.QUERY_ID = queryId; // Set the QUERY_ID for this iteration

//   displayHeader();

//   let token = await getToken();
//   fs.writeFileSync(TOKEN_FILE_PATH, token);
//   console.log('✅ New token has been saved.');
//   console.log('');

//   let loopCount = 0;

//   try {
//     const username = await getUsername(token);
//     const balance = await getBalance(token);
//     const tribe = await getTribe(token);

//     console.log(`👋 Hello, ${username}!`.cyan);
//     console.log(
//       `💰 Your current BLUM balance is: ${balance.availableBalance}`.green
//     );
//     console.log(`🎮 Your chances to play the game: ${balance.playPasses}`);
//     console.log('');

//     console.log('🏰 Your tribe details:');
//     if (tribe) {
//       console.log(`   - Name: ${tribe.title}`);
//       console.log(`   - Members: ${tribe.countMembers}`);
//       console.log(`   - Earn Balance: ${tribe.earnBalance}`);
//       console.log(`   - Your Role: ${tribe.role}`);
//       console.log('');
//     } else {
//       console.error('🚨 Tribe not found!'.red);
//       console.log('');
//       console.log(`Join HCA Tribe Duskusi AAI`.blue);
//       console.log('');
//     }

//     console.log('⌛ Please wait a moment...'.yellow);
//     await delay(5000);

//     const reward = await claimDailyReward(token);
//     if (reward) {
//       console.log('✅ Daily reward claimed successfully!'.green);
//     }
//     console.log('');

//     console.log('⌛ Please wait a moment...'.yellow);
//     await delay(5000);

//     console.log('🌾 Claiming farm reward...'.blue);
//     const claimResponse = await claimFarmReward(token);
//     if (claimResponse) {
//       console.log('✅ Farm reward claimed successfully!'.green);
//       const startAndMonitorFarmingSession = async () => {
//         const farmingSession = await startFarmingSession(token);
//         const farmStartTime = moment(farmingSession.startTime).format(
//           'MMMM Do YYYY, h:mm:ss A'
//         );
//         const farmEndTime = moment(farmingSession.endTime).format(
//           'MMMM Do YYYY, h:mm:ss A'
//         );

//         console.log(`✅ Farming session started!`.green);
//         console.log(`⏰ Start time: ${farmStartTime}`);
//         console.log(`⏳ End time: ${farmEndTime}`);

//         const farmDuration = farmingSession.endTime - farmingSession.startTime;

//         setTimeout(async () => {
//           console.log('🌾 Farming session ended. Generating new token and starting a new session...'.yellow);
//           token = await getToken(); // Generate new token
//           fs.writeFileSync(TOKEN_FILE_PATH, token); // Save new token
//           console.log('✅ New token has been generated and saved.'.green);
//           return handleTasksForQueryID(queryId);
//         }, farmDuration);
//       };
//       await startAndMonitorFarmingSession();
//       console.log('');
//     } else {
//       console.log('🚫 No farm reward available. Starting farming session instead...'.red);

//       // const startAndMonitorFarmingSession = async () => {
//       //   const farmingSession = await startFarmingSession(token);
//       //   const farmStartTime = moment(farmingSession.startTime).format(
//       //     'MMMM Do YYYY, h:mm:ss A'
//       //   );
//       //   const farmEndTime = moment(farmingSession.endTime).format(
//       //     'MMMM Do YYYY, h:mm:ss A'
//       //   );

//       //   console.log(`✅ Farming session started!`.green);
//       //   console.log(`⏰ Start time: ${farmStartTime}`);
//       //   console.log(`⏳ End time: ${farmEndTime}`);

//       //   const farmDuration = farmingSession.endTime - farmingSession.startTime;
//       //   setTimeout(async () => {
//       //     console.log('🌾 Farming session ended. Starting new session...'.yellow);
//       //     await startAndMonitorFarmingSession();
//       //   }, farmDuration);
//       // };
//       const startAndMonitorFarmingSession = async () => {
//         const farmingSession = await startFarmingSession(token);
//         const farmStartTime = moment(farmingSession.startTime).format(
//           'MMMM Do YYYY, h:mm:ss A'
//         );
//         const farmEndTime = moment(farmingSession.endTime).format(
//           'MMMM Do YYYY, h:mm:ss A'
//         );

//         console.log(`✅ Farming session started!`.green);
//         console.log(`⏰ Start time: ${farmStartTime}`);
//         console.log(`⏳ End time: ${farmEndTime}`);

//         const farmDuration = farmingSession.endTime - farmingSession.startTime;

//         setTimeout(async () => {
//           console.log('🌾 Farming session ended. Generating new token and starting a new session...'.yellow);
//           token = await getToken(); // Generate new token
//           fs.writeFileSync(TOKEN_FILE_PATH, token); // Save new token
//           console.log('✅ New token has been generated and saved.'.green);
//           return handleTasksForQueryID(queryId);
//         }, farmDuration);
//       };
//       await startAndMonitorFarmingSession();
//       console.log('');
//     }

//     console.log('⌛ Please wait a moment...'.yellow);
//     await delay(5000);

//     let gameSuccessful = false;

//     while (!gameSuccessful) {
//       console.log(`🎮 Checking if ${username} has already played the game...`.blue);

//       if (balance.playPasses > 0) {
//         let counter = balance.playPasses;

//         while (counter > 0) {
//           try {
//             const gameData = await getGameId(token);

//             console.log('⌛ Please wait for 30 second(s) to play the game...'.yellow);
//             await delay(30000);

//             const randPoints = Math.floor(Math.random() * (240 - 160 + 1)) + 400;

//             const letsPlay = await claimGamePoints(token, gameData.gameId, randPoints);

//             if (letsPlay === 'OK') {
//               const balance = await getBalance(token);
//               console.log(
//                 `🎮 Play game success! You got ${randPoints} BLUM`.green
//               );
//               console.log(
//                 `🪙 Your balance now: ${balance.availableBalance} BLUM`.green
//               );
//               console.log('');
//               counter--;
//             } else {
//               console.log('❌ Failed to play the game. Retrying...'.red);
//               console.log('');
//               break;
//             }

//             if (counter === 0) {
//               gameSuccessful = true;
//             }
//           } catch (error) {
//             loopCount++; // Menambahkan hitungan loop saat terjadi error
//             console.log(`⚠️ An error occurred while trying to play the game. Retrying...`.red);
//             console.log(`⚠️ Loop count: ${loopCount}`.red);
//             console.log('');

//             if (loopCount >= 100) {
//               console.log('🚨 Loop count has reached 100. Generating new token and restarting...'.red);
//               token = await getToken(); // Generate new token
//               fs.writeFileSync(TOKEN_FILE_PATH, token); // Save new token
//               loopCount = 0; // Reset loop count
//               return handleTasksForQueryID(queryId); // Restart the process for the same QUERY_ID
//             }

//             break;
//           }
//         }
//       } else {
//         console.log(
//           `🚫 You can't play again because you have ${balance.playPasses} chance(s)`.red
//         );
//         break;
//       }
//     }

//     console.log('');

//     console.log('⌛ Please wait a moment...'.yellow);
//     await delay(5000);

//     console.log('✅ Check auto completing tasks...'.green);
//     const tasksData = await getTasks(token);

//     let totalCompletedTasks = 0;
//     let totalFailedTasks = 0;
//     let totalRewards = 0;

//     for (const category of tasksData) {
//       for (const task of category.tasks) {
//         try {
//           if (task.status === 'FINISHED') {
//             totalCompletedTasks++;
//           } else if (task.status === 'NOT_STARTED') {
//             const startedTask = await startTask(token, task.id, task.title);
//             if (startedTask) {
//               const claimedTask = await claimTaskReward(token, task.id);
//               totalCompletedTasks++;
//               totalRewards += claimedTask.reward;
//             }
//           } else if (task.status === 'STARTED' || task.status === 'READY_FOR_CLAIM') {
//             const claimedTask = await claimTaskReward(token, task.id);
//             totalCompletedTasks++;
//             totalRewards += claimedTask.reward;
//           }
//         } catch (error) {
//           totalFailedTasks++;
//         }
//       }
//     }
//     console.log(`✅ Total tasks completed: ${totalCompletedTasks}`);
//     console.log(`🚫 Total tasks failed: ${totalFailedTasks}`);
//     console.log(`🎁 Total rewards: ${totalRewards}`);
//     console.log('');

//   } catch (error) {
//     console.error('🚨 Error occurred:'.red, error.message);
//   }
// }

// // Main loop to process all QUERY_IDs and restart every 20 minutes
// (async () => {
//   const queryIds = process.env.QUERY_IDS.split(',').map(line => line.trim());

//   while (true) {
//     for (const queryId of queryIds) {
//       await handleTasksForQueryID(queryId);
//       console.log('');
//       console.log(`🔄 Finished processing ${queryId}, moving to the next one...\n`.yellow);
//     }
//     console.log('✅ All QUERY_IDs processed! Waiting for 20 minutes before restarting...'.green);
//     console.log('');

//     const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//     const formatTime = (ms) => {
//       const totalSeconds = Math.floor(ms / 1000);
//       const hours = Math.floor(totalSeconds / 3600);
//       const minutes = Math.floor((totalSeconds % 3600) / 60);
//       const seconds = totalSeconds % 60;

//       return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//     };

//     const countdown = async (duration) => {
//       const start = Date.now();
//       let remaining = duration;

//       while (remaining > 0) {
//         const elapsed = Date.now() - start;
//         remaining = duration - elapsed;

//         const timeLeft = formatTime(remaining);
//         process.stdout.write(`⏳ Time left: ${timeLeft}\r`);

//         await delay(1000);
//       }

//       console.log(`✅ Time's up!`);
//     };

//     const duration = 1200000; // 20 minutes in milliseconds
//     await countdown(duration);
//   }
// })();

const handleTasksForQueryID = async (queryId) => {
  process.env.QUERY_ID = queryId; // Set the QUERY_ID for this iteration

  displayHeader();

  let token = await getToken();
  fs.writeFileSync(TOKEN_FILE_PATH, token);
  console.log('✅ New token has been saved.');
  console.log('');

  let loopCount = 0;

  try {
    const username = await getUsername(token);
    const balance = await getBalance(token);
    const tribe = await getTribe(token);

    console.log(`👋 Hello, ${username}!`.cyan);
    console.log(
      `💰 Your current BLUM balance is: ${balance.availableBalance}`.green
    );
    console.log(`🎮 Your chances to play the game: ${balance.playPasses}`);
    console.log('');

    console.log('🏰 Your tribe details:');
    if (tribe) {
      console.log(`   - Name: ${tribe.title}`);
      console.log(`   - Members: ${tribe.countMembers}`);
      console.log(`   - Earn Balance: ${tribe.earnBalance}`);
      console.log(`   - Your Role: ${tribe.role}`);
      console.log('');
    } else {
      console.error('🚨 Tribe not found!'.red);
      console.log('');
      console.log(`Join HCA Tribe Duskusi AAI`.blue);
      console.log('');
    }

    console.log('⌛ Please wait a moment...'.yellow);
    await delay(5000);

    const reward = await claimDailyReward(token);
    if (reward) {
      console.log('✅ Daily reward claimed successfully!'.green);
    }
    console.log('');

    console.log('⌛ Please wait a moment...'.yellow);
    await delay(5000);

    console.log('🌾 Claiming farm reward...'.blue);
    const claimResponse = await claimFarmReward(token);
    if (claimResponse) {
      console.log('✅ Farm reward claimed successfully!'.green);
      const startAndMonitorFarmingSession = async () => {
        const farmingSession = await startFarmingSession(token);
        const farmStartTime = moment(farmingSession.startTime).format(
          'MMMM Do YYYY, h:mm:ss A'
        );
        const farmEndTime = moment(farmingSession.endTime).format(
          'MMMM Do YYYY, h:mm:ss A'
        );

        console.log(`✅ Farming session started!`.green);
        console.log(`⏰ Start time: ${farmStartTime}`);
        console.log(`⏳ End time: ${farmEndTime}`);

        const farmDuration = farmingSession.endTime - farmingSession.startTime;

        setTimeout(async () => {
          console.log('🌾 Farming session ended. Generating new token and starting a new session...'.yellow);
          token = await getToken(); // Generate new token
          fs.writeFileSync(TOKEN_FILE_PATH, token); // Save new token
          console.log('✅ New token has been generated and saved.'.green);
          return handleTasksForQueryID(queryId);
        }, farmDuration);
      };
      await startAndMonitorFarmingSession();
      console.log('');
    } else {
      console.log('🚫 No farm reward available. Starting farming session instead...'.red);

      const startAndMonitorFarmingSession = async () => {
        const farmingSession = await startFarmingSession(token);
        const farmStartTime = moment(farmingSession.startTime).format(
          'MMMM Do YYYY, h:mm:ss A'
        );
        const farmEndTime = moment(farmingSession.endTime).format(
          'MMMM Do YYYY, h:mm:ss A'
        );

        console.log(`✅ Farming session started!`.green);
        console.log(`⏰ Start time: ${farmStartTime}`);
        console.log(`⏳ End time: ${farmEndTime}`);

        const farmDuration = farmingSession.endTime - farmingSession.startTime;

        setTimeout(async () => {
          console.log('🌾 Farming session ended. Generating new token and starting a new session...'.yellow);
          token = await getToken(); // Generate new token
          fs.writeFileSync(TOKEN_FILE_PATH, token); // Save new token
          console.log('✅ New token has been generated and saved.'.green);
          return handleTasksForQueryID(queryId);
        }, farmDuration);
      };
      await startAndMonitorFarmingSession();
      console.log('');
    }

    console.log('⌛ Please wait a moment...'.yellow);
    await delay(5000);

    let gameSuccessful = false;

    while (!gameSuccessful) {
      console.log(`🎮 Checking if ${username} has already played the game...`.blue);

      if (balance.playPasses > 0) {
        let counter = balance.playPasses;

        while (counter > 0) {
          try {
            const gameData = await getGameId(token);

            console.log('⌛ Please wait for 30 second(s) to play the game...'.yellow);
            await delay(30000);

            const randPoints = Math.floor(Math.random() * (240 - 160 + 1)) + 400;

            const letsPlay = await claimGamePoints(token, gameData.gameId, randPoints);

            if (letsPlay === 'OK') {
              const balance = await getBalance(token);
              console.log(
                `🎮 Play game success! You got ${randPoints} BLUM`.green
              );
              console.log(
                `🪙 Your balance now: ${balance.availableBalance} BLUM`.green
              );
              console.log('');
              counter--;
            } else {
              console.log('❌ Failed to play the game. Retrying...'.red);
              console.log('');
              break;
            }

            if (counter === 0) {
              gameSuccessful = true;
            }
          } catch (error) {
            loopCount++; // Menambahkan hitungan loop saat terjadi error
            console.log(`⚠️ An error occurred while trying to play the game. Retrying...`.red);
            console.log(`⚠️ Loop count: ${loopCount}`.red);
            console.log('');

            if (loopCount >= 100) {
              console.log('🚨 Loop count has reached 100. Generating new token and restarting...'.red);
              token = await getToken(); // Generate new token
              fs.writeFileSync(TOKEN_FILE_PATH, token); // Save new token
              loopCount = 0; // Reset loop count
              return handleTasksForQueryID(queryId); // Restart the process for the same QUERY_ID
            }

            break;
          }
        }
      } else {
        console.log(
          `🚫 You can't play again because you have ${balance.playPasses} chance(s)`.red
        );
        break;
      }
    }

    console.log('');

    console.log('⌛ Please wait a moment...'.yellow);
    await delay(5000);

    console.log('✅ Check auto completing tasks...'.green);
    const tasksData = await getTasks(token);

    let totalCompletedTasks = 0;
    let totalFailedTasks = 0;
    let totalRewards = 0;

    for (const category of tasksData) {
      for (const task of category.tasks) {
        try {
          if (task.status === 'FINISHED') {
            totalCompletedTasks++;
          } else if (task.status === 'NOT_STARTED') {
            const startedTask = await startTask(token, task.id, task.title);
            if (startedTask) {
              const claimedTask = await claimTaskReward(token, task.id);
              totalCompletedTasks++;
              totalRewards += claimedTask.reward;
            }
          } else if (task.status === 'STARTED' || task.status === 'READY_FOR_CLAIM') {
            const claimedTask = await claimTaskReward(token, task.id);
            totalCompletedTasks++;
            totalRewards += claimedTask.reward;
          }
        } catch (error) {
          // Check for status code 520
          if (error.response && error.response.status === 520) {
            console.log('🚨 Received status code 520, restarting process...'.red);
            return handleTasksForQueryID(queryId);
          }
          totalFailedTasks++;
        }
      }
    }
    console.log(`✅ Total tasks completed: ${totalCompletedTasks}`);
    console.log(`🚫 Total tasks failed: ${totalFailedTasks}`);
    console.log(`🎁 Total rewards: ${totalRewards}`);
    console.log('');

  } catch (error) {
    console.error('🚨 Error occurred:'.red, error.message);
    // Check for status code 520
    if (error.response && error.response.status === 520) {
      console.log('🚨 Received status code 520, restarting process...'.red);
      return handleTasksForQueryID(queryId);
    }
  }
}

