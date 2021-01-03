const path = require("path");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const { Engine, Task, utils, vm } = require("yajsapi");
const { program } = require("commander");

dayjs.extend(duration);

const { asyncWith, logUtils, range } = utils;
vmHash = "b2b0621ab4b4034e1c7658c4a323d88d79b3a37432f9ae51372794e1"; // flan golem vm hash
output_directory = "golem/output";

async function main(subnetTag) {
  const _package = await vm.repo(
    vmHash,
    0.5,
    2.0
  );

  async function* worker(ctx, tasks) {
        
    for await (let task of tasks) {
        ctx.send_json("golem/work/params.json", {
            first_year: "2012",
            last_year: "2018",
            count: "10",
            origin_code: "PAN"
          });
        //ctx.run("golem/work/run-flan.sh");
        const output_image = "TEST_VALUES.csv";
        ctx.download_file(
          `${output_directory}/${output_image}`,
          path.join(__dirname, `./${output_image}`)
        );
        // const output_image = "baci_plot.png";        
        // ctx.download_file(
        //   `${output_directory}/${output_image}`,
        //   path.join(__dirname, `./${output_image}`)
        // );
        //const output_data = "baci_result.csv";
        // ctx.download_file(
        //   `${output_directory}/baci_result.csv`,
        //   path.join(__dirname, "./baci_result.csv")
        // );
        yield ctx.commit();
        // TODO: Check
        // job results are valid // and reject by:
        // task.reject_task(msg = 'invalid file')
        task.accept_task(output_image);
    }

    ctx.log("no more frames to render");
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
