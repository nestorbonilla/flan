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
//vmHash = "9a3b5d67b0b27746283cb5f287c13eab1beaa12d92a9f536b747c7ae"; // to replace for new golem vm hash
vmHash = "e9afcdb56bb8d46a3a2dacc46dd504141b5440188f8f4c77c3b596c4"; // flan golem vm hash

router.post('/analyze', async (req, res, next) => {

  try {

    // 1. Receiving data
    console.log("data to analyze: ", req.body);
    //console.log("args: ", process.argv);
    //program
    //  .storeOptionsAsProperties(true)
    //  .passCommandToAction(true);
    // program
    //   .storeOptionsAsProperties(false)
    //   .passCommandToAction(false);
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
        ctx.send_json("golem/work/params.json", {
          first_year: req.body.startYear,
          last_year: req.body.endYear,
          count: req.body.count,
          origin_code: req.body.origin
        });
        ctx.run("python3 golem/work/calculation.py");
        const output_file = `output_${task.toString()}.png`
        ctx.download_file(
          "golem/output/baci_plot.png",
          path.join(__dirname, `../output_${task}.png`)
        );
        yield ctx.commit();
        // TODO: Check
        // job results are valid // and reject by:
        // task.reject_task(msg = 'invalid file')
        task.accept_task(output_file);
      }
  
      ctx.log("no more frames to render");
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