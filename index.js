// ===================================
// Notes
// ===================================
// 똔괭이쉑히: 224184421568217088 

const Discord = require("discord.js-selfbot");
const client = new Discord.Client();
const prompt = require("prompt-sync")();
const IsAuto = prompt("Auto? Using this client, Not a desktop 0=off 1=on > ")
const IsSpecificUser = prompt("The scope sets a specific user? 0=off 1=on > ")
const IsUseAFK = prompt("AFK? 0=off 1=on > ")
let msg;
if (IsUseAFK == 1) { msg = prompt("Enter The AFK Message > ") }

require('log-timestamp')(function() {
  return '[' + require('moment-timezone').tz("Asia/Seoul").format('YYYY-MM-DD HH:mm:ss' + ']');});

client.on('ready', () => {
  console.log(`똥괭이 감지기 ON`);
  //console.log(process.env.ServerID);

  if (IsAuto == 1)
  {
    const channel = client.channels.cache.get(process.env.ChannelID);
    let oldchannel;
    if (!channel) return console.error("The channel does not exist!");
    channel.join().then(connection => {
        // Yay, it worked!
      console.log("성공적으로 접속됨.");
      oldchannel = connection;

      // 처음 접속했을때 2명이상이면 나가는것도 고려
    }).catch(e => {
  
        // Oh no, it errored! Let's log it to console :)
        console.error(e);
    });

    setInterval(function() {
      // 특정유저가 없으면 다시 접속하는 것도 고려 foreach 같은거 
      if (typeof oldchannel === 'undefined' && oldchannel != null) return;
      if (oldchannel.status == 0 || oldchannel.status == 1) return;
      if (channel.members.size > 0) return console.log (channel.members.size,
                                            "명 이상 해당 채널에 존재함");
      if (!channel) return console.error("The channel does not exist!");
      channel.join().then(connection => {
          // Yay, it worked!
          console.log("성공적으로 재접속됨.");
          oldchannel = connection;
      }).catch(e => {
    
          // Oh no, it errored! Let's log it to console :)
          console.error(e);
      });
    }, 10000)
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // 특정 서버 ID 체크
    if (oldState.guild.id === process.env.GuildID || newState.guild.id === process.env.GuildID)
    {
      if(newState.channelID === null) // 떠남
      {
        // 다른 사람 일 경우만
        if (newState.guild.me.id != newState.member.id)
        {
          console.log('해당 보이스 채널 떠남 감지', oldState.channelID);
          //음성채널에 있는 타인  ID
          console.log('해당유저ID:', newState.member.id);
        }
      }
      else if(oldState.channelID === null) // 입장
      {
        // 다른 사람 일 경우
        if (newState.guild.me.id != newState.member.id)
        {
          console.log('해당 보이스 채널 입장 감지', newState.channelID);

          //음성채널에 있는 타인  ID
          console.log('해당유저ID:', newState.member.id);

          //console.log("=== 테스트 ====");
          if (IsAuto == 1)
          {
            const channel = client.channels.cache.get(process.env.ChannelID);
            if (IsSpecificUser == 1 && newState.member.id === process.env.specificUserID)
              try {
                console.log("특정유저가 확인되어 채널을 떠남.");
                channel.leave()
              }
              catch(e) {
                console.log("Failed to leave the channel");
              }
            else if(IsSpecificUser == 0)
            {
              try {
                  console.log("성공적으로 채널을 떠남.");
                  channel.leave()
                }
                catch(e) {
                  console.log("Failed to leave the channel");
                }
            }
          }
        }
      }
      else if(typeof oldState.channelID === 'undefined' && newState.channelID != null) // 처음 입장인 경우
      {
        // 다른 사람 일 경우만
        if (newState.guild.me.id != newState.member.id)
        {
          console.log('해당 보이스 채널 첫 입장 감지', newState.channelID);

          //음성채널에 있는 타인  ID
          console.log('해당유저ID:', newState.member.id);

        
          //console.log("=== 테스트 ====");
          if (IsAuto == 1)
          {
            const channel = client.channels.cache.get(process.env.ChannelID);
            if (IsSpecificUser == 1 && newState.member.id === process.env.specificUserID)
              try {
                console.log("특정유저가 확인되어 채널을 떠남.");
                channel.leave()
              }
              catch(e) {
                console.log("Failed to leave the channel");
              }
            else if(IsSpecificUser == 0)
            {
              try {
                  console.log("성공적으로 채널을 떠남.");
                  channel.leave()
                }
                catch(e) {
                  console.log("Failed to leave the channel");
                }
            }
          }
        }

        // 아래꺼 안됨 둘다
        //newState.channel.guild.me.voice.setSelfDeaf(true);
        // 위에는 프로그램에 반영이 안됨 오류는 안뜸
        //newState.guild.me.voice.connection.disconnect();

        //음성채널에 있는 무조건 내 ID
        //console.log('본인', newState.guild.me.id);
        //음성채널에 있는 타인  ID
        //console.log('타인', newState.member.id);
        
        // 이거 하면 여기만 로그오프됨
        // client.destroy();
        
        //킥 명령어
        //newState.member.voice.kick();
      }
      /*else 
      {
        console.log('유저 보이스 채널 이동', oldState.channelID, newState.channelID);
      }*/
    }
});

//  .then(console.log)
//  .catch(console.error);
//===============================
// 자동 DM 응답
//===============================
client.on('message', async message => {
  if (IsUseAFK == 1)
  {
    if (message.channel.type == 'dm' && message.author.id !== client.user.id){
      message.reply(msg);
      console.log(message.author.tag,'('+ message.author.id + ')',
        '에게 자동 응답 메세지를 보냈습니다');
    }
  }
});

client.login(process.env.TOKEN);