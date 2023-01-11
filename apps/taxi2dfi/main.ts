import { Command } from 'commander';
import { taxiToDfi } from './taxi-to-dfi';

const program = new Command();

program
  .name('taxi2dfi')
  .description('CLI to convert a .parquet file from NYC taxi data in 2009 to .csv')
  .argument('<input>', 'input file')
  .requiredOption('-t, --api-token <token>', 'Your API token')
  .option('--dfi-url [dfiUrl]', 'Path to the DFI HTTP API. Leave blank to use production')
  .option('-i, --instance [name]', 'The instance name. Leave blank to use the default instance')
  .option(
    '-p, --points [numberOfPoints]',
    'The number of points to process. Leave blank to process all points',
  )
  .option('-c, --taxi-color [color]', 'The color of taxi, usually in the file name', 'yellow')
  .action(taxiToDfi)
  .parse();
