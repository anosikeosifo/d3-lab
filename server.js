const http = require("http");
const fs = require("fs");
const path = require("path");
const D3_PORT = 7050;
const projects = ["fem-starter", "fem-intro"];
let CURRENT_PROJECT;

const handleFaviconRequest = res => {
  console.log("favicon requested");
  res.writeHead(200, { "Content-Type": "image/x-icon" });
};

const loadProject = (response, fileName) => {
  let fileExtension = path.extname(fileName);
  fileExtension.length
    ? renderProjectAssets(response, fileName, fileExtension.substring(1))
    : renderProjectIndex(response, fileName);
};

const renderProjectIndex = (response, projectName) => {
  if (!projects.includes(projectName)) return render404(response);

  CURRENT_PROJECT = projectName;
  setResponseHeaders(response, "html");

  fs.readFile(`./${projectName}/index.html`, (error, fileData) => {
    if (!error) {
      response.write(fileData);
    } else {
      response.write(
        JSON.stringify({
          status: "false",
          error
        })
      );
    }
    response.end();
  });
};

const renderProjectAssets = (response, assetPath, assetType) => {
  if (!CURRENT_PROJECT) return render404(response);
  setResponseHeaders(response, assetType);

  fs.readFile(`./${CURRENT_PROJECT}/${assetPath}`, (error, fileData) => {
    if (!error) {
      response.write(fileData);
    } else {
      console.log();
      response.write(
        JSON.stringify({
          status: "false",
          error
        })
      );
    }
    response.end();
  });
};

const handleGet = (req, res) => {
  if (req.url.endsWith(".ico")) {
    handleFaviconRequest(res);
  } else {
    loadProject(res, req.url.substring(1));
  }
};

const handlePost = (req, response) => {
  req.on("end", chunk => {
    res.write(
      JSON.stringify({
        success: true,
        data: "OK"
      })
    );
    response.end();
  });
};

const handleDelete = (req, res) => {};

const handlePut = (req, res) => {};

const render404 = response => {
  setResponseHeaders(response);

  fs.readFile("./public/404.html", (error, fileData) => {
    if (!error) {
      response.write(fileData);
    } else {
      response.write(
        JSON.stringify({
          status: "false",
          error
        })
      );
    }
    response.end();
  });
};

const requestHandlers = {
  GET: handleGet,
  POST: handlePost,
  PUT: handlePut,
  DELETE: handleDelete
};

const setResponseHeaders = (res, fileExtension = null) => {
  if (fileExtension) {
    res.setHeader("Content-Type", `${setContentType(fileExtension)} charset='utf-8'`);
  } else {
    res.setHeader("Content-Type", "text/html;charset='utf-8'");
  }
};

const setContentType = fileExtension => {
  return `text/${fileExtension};`;
};

///
//
////
/////
///
//
///

const d3Server = http.createServer((req, res) => {
  req.setEncoding("utf8");
  console.log("request method", req.method);
  // handleFaviconRequest(req, res);
  requestHandlers[req.method](req, res);
});

d3Server.listen(D3_PORT, () => {
  console.log(`D3 server listening on port ${D3_PORT}`);
});
