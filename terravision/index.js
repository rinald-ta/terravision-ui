import fs from 'fs';
import process from 'process';
import { AwsArchitecture } from '@aws/pdk/aws-arch/index.js';

const extractResourceIdentifiers = () => {
  const resourceIdentifiers = {};

  const categories = Object.values(AwsArchitecture.categories);

  for (const category of categories) {
    for (const service of category.categoryServices()) {
      for (const resource of service.serviceResources()) {
        resourceIdentifiers[resource.cfnResourceType.toLowerCase()] =
          resource.icon('png');
      }
    }
  }

  // write to file
  fs.writeFileSync(
    '/app/resourceIdentifiers.json',
    JSON.stringify(resourceIdentifiers, null, 2)
  );
};

async function readGraphInput() {
  let graph = '';

  // read graph from stdin
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    graph += chunk;
  }

  return graph;
}

async function transformResourceGraph() {
  // read graph from stdin
  let graph = await readGraphInput();

  // load resource identifiers from json file
  const resourceIdentifiers = JSON.parse(
    fs.readFileSync('/app/resourceIdentifiers.json', 'utf8')
  );

  // load terraform to aws resource mapping
  const terraformToAws = JSON.parse(
    fs.readFileSync('/app/terraformToAws.json', 'utf8')
  );

  const resourcePattern = /"aws\w+\.\w+"/g;

  const resourceIdentifiersInGraph = new Set(graph.match(resourcePattern));

  for (const identifier of resourceIdentifiersInGraph.values()) {
    const terraformIdentifier = identifier.split('.')[0].replaceAll('"', '');
    const resourceIdentifier = terraformToAws[terraformIdentifier];

    graph = graph.replaceAll(identifier, `"${resourceIdentifier}"`);

    if (resourceIdentifier in resourceIdentifiers) {
      const icon = resourceIdentifiers[resourceIdentifier];
      graph = graph.replace(
        `label="${resourceIdentifier}"`,
        `label=< <table border="0" cellborder="1"><tr><td bgcolor="white">${resourceIdentifier}</td></tr></table> >, labelloc="b" image="${icon}", shape=none, width=2, height=2, fixedsize=true`
      );
    }
  }

  // insert imagepath
  const lines = graph.split('\n');
  lines.splice(
    2,
    0,
    `  imagepath="/app/node_modules/@aws/pdk/assets/aws-arch"\n  nodesep=2\n  ranksep=1`
  );
  graph = lines.join('\n');

  console.log(graph);
}

extractResourceIdentifiers();
transformResourceGraph();
