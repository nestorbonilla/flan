const path = require("path");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const { Engine, Task, utils, vm } = require("yajsapi");
const { program } = require("commander");

dayjs.extend(duration);

const { asyncWith, logUtils, range } = utils;
vmHash = "64f3f05321861c9001f3a6adfa38832401c77c9e17b6353bac58b8b2"; // flan golem vm hash
output_directory = "/golem/output";

async function main(subnetTag) {
  const _package = await vm.repo(
    vmHash,
    0.5,
    2.0
  );

  async function* worker(ctx, tasks) {
        
    for await (let task of tasks) {

      // SENDING PARAMETERS TO VM
      // ctx.send_json("/golem/work/params.json", {
      //     first_year: "2012",
      //     last_year: "2018",
      //     count: "10",
      //     origin_code: "PAN"
      //   });

      // TEST - GETTING LOG FILE
      ctx.run("/golem/work/run-flan.sh");
      const output_file = "log.txt";
      const output_log = `/golem/output/${output_file}`;
      const output_directory = `${__dirname}/${output_file}`;
      console.log("vm location: ", output_log);
      console.log("local location: ", output_directory);
      ctx.download_file(output_log, output_directory);

      // TEST - GETTING TEST_VALUES.csv
      // const output_file = "TEST_VALUES.csv";
      // const output_log = `/golem/output/${output_file}`;
      // const output_directory = `${__dirname}/${output_file}`;
      // console.log("vm location: ", output_log);
      // console.log("local location: ", output_directory);
      // ctx.download_file(output_log, output_directory);

      // DOWNLOAD PLOT IMAGE
      // const output_file = "baci_plot.png";
      // ctx.download_file(
      //   `${output_directory}/${output_file}`,
      //   path.join(__dirname, `./${output_file}`)
      // );

      // DOWNLOAD CSV RESULTS
      //const output_file = "baci_result.csv";
      // ctx.download_file(
      //   `${output_directory}/${output_file}`,
      //   path.join(__dirname, "./${output_file}")
      // );

      yield ctx.commit();
      // TODO: Check
      // job results are valid // and reject by:
      // task.reject_task(msg = 'invalid file')
      task.accept_task(output_file);
    }

    ctx.log("no more calculations to do");
    return;
  }

  const frames = range(0, 5, 5);
  const timeout = dayjs.duration({ minutes: 15 }).asMilliseconds();

  await asyncWith(
    await new Engine(
      _package,
      6,
      timeout, //5 min to 30 min
      "10.0",
      undefined,
      subnetTag,
      logUtils.logSummary()
    ),
    async (engine) => {
      for await (let task of engine.map(
        worker,
        frames.map((frame) => new Task(frame))
      )) {
        console.log("result=", task.output());
      }
    }
  );
  return;
}

program
  .option('--subnet-tag <subnet>', 'set subnet name', 'community.3')
  .option('-d, --debug', 'output extra debugging');
program.parse(process.argv);
if (program.debug) {
  utils.changeLogLevel("debug");
}
console.log(`Using subnet: ${program.subnetTag}`);
main(program.subnetTag);
