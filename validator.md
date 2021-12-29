How to setup and start

Get a Ubuntu server first and do the followings:

- install Node 14.
  `sudo apt update`
  `curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -`
  `sudo apt -y install nodejs`
  `sudo apt -y install gcc g++ make`

- clone the project
  `git clone git@github.com:ArableProtocol/arablevalidator.git`

- Install pm2
  `npm install -g pm2`

- Go inside arablevalidator and config environment
  `cd ./arablevalidator`
  `cp env.example .env`
- Open .env file and config privateKey and save.
  `nano .env`
- start pm2
  `pm2 start npm -- run tokenvesting --`

- list pm2: `pm2 list`
- check pm2 log: `pm2 logs 0` (0: pm2 Id)
- restart pm2: `pm2 restart 0`
- stop pm2: `pm2 stop 0`

- update and restart
  `git pull`
  `pm2 restart 0`
