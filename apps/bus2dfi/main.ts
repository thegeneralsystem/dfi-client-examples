import { Command } from 'commander';
import { busToDfi } from './bus-to-dfi';

const program = new Command();

program
  .name('bus2dfi')
  .description(
    'CLI to take vehicle location data from the Bus Open Data service and send it to DFI',
  )
  // No args
  .argument('[]')
  .requiredOption('-t, --api-token <token>', 'Your DFI API token')
  .requiredOption('-gt, --gov-api-token <token>', 'Your gov.uk API token')
  .option('--dfi-url [dfiUrl]', 'Path to the DFI HTTP API. Leave blank to use production')
  .option('-i, --instance [name]', 'The instance name. Leave blank to use the default instance')
  .option(
    '-r, --route [routeNumber...]',
    'The bus route number to filter by. Leave blank to get all routes',
  )
  .option<number>(
    '-s, --startTimeAfter [startTime]',
    'The time from the feed which to start getting ',
    (value) => Number(value),
    Math.round(Date.now() / 1000),
  )
  .action(busToDfi)
  .parse();
