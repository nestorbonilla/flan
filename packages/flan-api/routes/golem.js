const express = require('express');
const router = express.Router();
const path = require("path");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const { Engine, Task, utils, vm } = require("yajsapi");
const { program } = require("commander");

dayjs.extend(duration);
const { asyncWith, logUtils, range } = utils;
const frames = range(0, 60, 10);
const timeout = dayjs.duration({ minutes: 15 }).asMilliseconds();
vmHash = "b44ef57a54eee143a9f6ab2e6825a49a08379e7e228b4b62edf640cc"; // flan golem vm hash

router.post('/analyze', async (req, res, next) => {

  try {
    console.log("2. Receiving request in api...");
    console.log("3. Params to analyze: ", req.body);
    program
     .storeOptionsAsProperties(true)
     .passCommandToAction(true);
    program
      .option('--subnet-tag <subnet>', 'set subnet name', 'community.3')
      .option('-d, --debug', 'output extra debugging');
    program.parse(process.argv);
    if (program.debug) {
      utils.changeLogLevel("debug");
    }
    console.log(`Using subnet: ${program.subnetTag}`);

    const _package = await vm.repo(
      vmHash,
      0.5,
      2.0
    );

    async function* worker(ctx, tasks) {

      for await (let task of tasks) {
        ctx.send_json("/golem/work/params.json", {
          first_year: req.body.startYear,
          last_year: req.body.endYear,
          count: req.body.count,
          origin_code: req.body.origin,
          type_code: req.body.type
        });
        ctx.run("/golem/work/run_flan.sh");
        const output_file = "baci_plot.png";
        ctx.download_file(
          `/golem/output/${output_file}`,
          path.join(__dirname, `./${output_file}`)
        );
        yield ctx.commit();
        // TODO: Check
        // job results are valid // and reject by:
        // task.reject_task(msg = 'invalid file')
        task.accept_task(output_file);
      }
  
      ctx.log("no more images to download");
      return;
    }

    await asyncWith(
      await new Engine(
        _package,
        6,
        timeout, //5 min to 30 min
        "10.0",
        undefined,
        program.subnetTag,
        logUtils.logSummary()
      ),
      async (engine) => {
        for await (let task of engine.map(
          worker,
          frames.map((frame) => new Task(frame))        
        )) {
          console.log("result=", task.output());
          // 6. RETURN COMPLETE
          res.json( {
            result: "OK"
          });
        }
      }
    );
    

  } catch (err) {
      next(err);
  }
});

module.exports = router;