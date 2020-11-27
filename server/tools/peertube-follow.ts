import { registerTSPaths } from '../helpers/register-ts-paths'
registerTSPaths()

import * as program from 'commander'
import { getAdminTokenOrDie, getServerCredentials } from './cli'
import { getFollowingListPaginationAndSort, follow, unfollow } from '@shared/extra-utils/server/follows'

program
  .name('follow')
  .usage('[command] [options]')

program
  .command('list')
  .description('List followed instances')
  .action(() => listFollowedInstancesCLI())

program
  .command('add')
  .description('Follow an instance')
  .option('-u, --url <url>', 'Server url')
  .option('-U, --username <username>', 'Username')
  .option('-p, --password <token>', 'Password')
  .option('-h, --host <hostname>', 'Host')
  .action((options) => followCLI(options))

program
  .command('remove')
  .description('Unfollow an instance')
  .option('-u, --url <url>', 'Server url')
  .option('-U, --username <username>', 'Username')
  .option('-p, --password <token>', 'Password')
  .option('-h, --host <hostname>', 'Host')
  .action((options) => unfollowCLI(options))

program.parse(process.argv)

// ----------------------------------------------------------------------------

async function listFollowedInstancesCLI () {
  const { url, username, password } = await getServerCredentials(program)
  getFollowingListPaginationAndSort({
    url: url,
    start: 0,
    count: 50,
    sort: '-createdAt'
  })
}

async function followCLI (options: { hostname: string }) {
  const { url, username, password } = await getServerCredentials(program)
  const accessToken = await getAdminTokenOrDie(url, username, password)

  follow(url, [options['hostname']], accessToken)

  try {
    await follow(url, [options['hostname']], accessToken)

    console.log(`Successfully followed ${ options['hostname'] }`)

    process.exit(0)
  } catch (err) {
    if (err.message.includes(500)) {
      console.error('Cannot follow an non-HTTPS server.')
    } else {
      console.error(err)
    }

    process.exit(-1)
  }
}

async function unfollowCLI (options: { hostname: string }) {

}
