require("dotenv").config(); // loads local .env if present
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// AWS SDK v3
const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { LambdaClient } = require("@aws-sdk/client-lambda");
const { EC2Client } = require("@aws-sdk/client-ec2");
const { LightsailClient } = require("@aws-sdk/client-lightsail");
const { BatchClient } = require("@aws-sdk/client-batch");
const { ElasticBeanstalkClient } = require("@aws-sdk/client-elastic-beanstalk");
const { OutpostsClient } = require("@aws-sdk/client-outposts");
const { FSxClient } = require("@aws-sdk/client-fsx");
const { GlacierClient } = require("@aws-sdk/client-glacier");
const { StorageGatewayClient } = require("@aws-sdk/client-storage-gateway");
const { RDSClient } = require("@aws-sdk/client-rds");
const { RedshiftClient } = require("@aws-sdk/client-redshift");
const { ElastiCacheClient } = require("@aws-sdk/client-elasticache");
const { Route53Client } = require("@aws-sdk/client-route-53");
const { CloudFrontClient } = require("@aws-sdk/client-cloudfront");
const { DirectConnectClient } = require("@aws-sdk/client-direct-connect");
const { GlobalAcceleratorClient } = require("@aws-sdk/client-global-accelerator");
const { ElasticLoadBalancingClient } = require("@aws-sdk/client-elastic-load-balancing");
const { EMRClient } = require("@aws-sdk/client-emr");
const { KinesisClient } = require("@aws-sdk/client-kinesis");
const { GlueClient } = require("@aws-sdk/client-glue");
const { QuickSightClient } = require("@aws-sdk/client-quicksight");
const { AthenaClient } = require("@aws-sdk/client-athena");
const { ECSClient } = require("@aws-sdk/client-ecs");
const { ECRClient } = require("@aws-sdk/client-ecr");
const { FirehoseClient } = require("@aws-sdk/client-firehose");
const { SecretsManagerClient } = require("@aws-sdk/client-secrets-manager");
const { SSMClient } = require("@aws-sdk/client-ssm");
const { SESClient } = require("@aws-sdk/client-ses");
const { AmplifyClient } = require("@aws-sdk/client-amplify");
const { IAMClient } = require("@aws-sdk/client-iam");
const { GuardDutyClient } = require("@aws-sdk/client-guardduty");
const { ShieldClient } = require("@aws-sdk/client-shield");
const { WAFClient } = require("@aws-sdk/client-waf");
const { KMSClient } = require("@aws-sdk/client-kms");
const { SageMakerClient } = require("@aws-sdk/client-sagemaker");
const { RekognitionClient } = require("@aws-sdk/client-rekognition");
const { CodeCommitClient } = require("@aws-sdk/client-codecommit");
const { CodeBuildClient } = require("@aws-sdk/client-codebuild");
const { CodeDeployClient } = require("@aws-sdk/client-codedeploy");
const { CodePipelineClient } = require("@aws-sdk/client-codepipeline");
const { Cloud9Client } = require("@aws-sdk/client-cloud9");
const { CloudFormationClient } = require("@aws-sdk/client-cloudformation");
const { CloudTrailClient } = require("@aws-sdk/client-cloudtrail");
const { CloudWatchClient } = require("@aws-sdk/client-cloudwatch");
const { ConfigServiceClient } = require("@aws-sdk/client-config-service");
const { SQSClient } = require("@aws-sdk/client-sqs");
const { SNSClient } = require("@aws-sdk/client-sns");
const { MQClient } = require("@aws-sdk/client-mq");
const { IoTClient } = require("@aws-sdk/client-iot");
const { MediaConvertClient } = require("@aws-sdk/client-mediaconvert");
const { MediaLiveClient } = require("@aws-sdk/client-medialive");
const { MediaPackageClient } = require("@aws-sdk/client-mediapackage");
const { MediaStoreClient } = require("@aws-sdk/client-mediastore");
const { MigrationHubClient } = require("@aws-sdk/client-migration-hub");
const { DatabaseMigrationServiceClient } = require("@aws-sdk/client-database-migration-service");
const { SnowballClient } = require("@aws-sdk/client-snowball");
const { TransferClient } = require("@aws-sdk/client-transfer");
const { WorkSpacesClient } = require("@aws-sdk/client-workspaces");
const { AppStreamClient } = require("@aws-sdk/client-appstream");
const { WorkDocsClient } = require("@aws-sdk/client-workdocs");
const { BraketClient } = require("@aws-sdk/client-braket");
const { RoboMakerClient } = require("@aws-sdk/client-robomaker");
const { GroundStationClient } = require("@aws-sdk/client-groundstation");
const { EFSClient } = require("@aws-sdk/client-efs");
const { PinpointClient } = require("@aws-sdk/client-pinpoint");
const { GameLiftClient } = require("@aws-sdk/client-gamelift");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { NeptuneClient } = require("@aws-sdk/client-neptune");
const { OpenSearchClient } = require("@aws-sdk/client-opensearch");
const { LakeFormationClient } = require("@aws-sdk/client-lakeformation");
const { TranscribeClient } = require("@aws-sdk/client-transcribe");
const { PollyClient } = require("@aws-sdk/client-polly");
const { TranslateClient } = require("@aws-sdk/client-translate");
const { ForecastClient } = require("@aws-sdk/client-forecast");
const { KendraClient } = require("@aws-sdk/client-kendra");
const { PersonalizeClient } = require("@aws-sdk/client-personalize");
const { TextractClient } = require("@aws-sdk/client-textract");
const { EventBridgeClient } = require("@aws-sdk/client-eventbridge");
const { DirectoryServiceClient } = require("@aws-sdk/client-directory-service");
const { ACMClient } = require("@aws-sdk/client-acm");
const { InspectorClient } = require("@aws-sdk/client-inspector");
const { MacieClient } = require("@aws-sdk/client-macie");
const { CostExplorerClient } = require("@aws-sdk/client-cost-explorer");
const { AppFlowClient } = require("@aws-sdk/client-appflow");
const { SFNClient } = require("@aws-sdk/client-sfn"); // Step Functions
const { LexModelBuildingServiceClient } = require("@aws-sdk/client-lex-model-building-service"); // Lex

// Map of AWS services to their respective SDK clients
const serviceClients = {
  s3: S3Client,
  dynamodb: DynamoDBClient,
  lambda: LambdaClient,
  ec2: EC2Client,
  lightsail: LightsailClient,
  batch: BatchClient,
  elasticbeanstalk: ElasticBeanstalkClient,
  outposts: OutpostsClient,
  fsx: FSxClient,
  glacier: GlacierClient,
  storagegateway: StorageGatewayClient,
  rds: RDSClient,
  redshift: RedshiftClient,
  elasticache: ElastiCacheClient,
  route53: Route53Client,
  cloudfront: CloudFrontClient,
  directconnect: DirectConnectClient,
  globalaccelerator: GlobalAcceleratorClient,
  elb: ElasticLoadBalancingClient,
  emr: EMRClient,
  kinesis: KinesisClient,
  glue: GlueClient,
  quicksight: QuickSightClient,
  athena: AthenaClient,
  ecs: ECSClient,
  ecr: ECRClient,
  firehose: FirehoseClient,
  secretsmanager: SecretsManagerClient,
  ssm: SSMClient,
  ses: SESClient,
  amplify: AmplifyClient,
  iam: IAMClient,
  guardduty: GuardDutyClient,
  shield: ShieldClient,
  waf: WAFClient,
  kms: KMSClient,
  sagemaker: SageMakerClient,
  rekognition: RekognitionClient,
  codecommit: CodeCommitClient,
  codebuild: CodeBuildClient,
  codedeploy: CodeDeployClient,
  codepipeline: CodePipelineClient,
  cloud9: Cloud9Client,
  cloudformation: CloudFormationClient,
  cloudtrail: CloudTrailClient,
  cloudwatch: CloudWatchClient,
  configservice: ConfigServiceClient,
  sqs: SQSClient,
  sns: SNSClient,
  mq: MQClient,
  iot: IoTClient,
  mediaconvert: MediaConvertClient,
  medialive: MediaLiveClient,
  mediapackage: MediaPackageClient,
  mediastore: MediaStoreClient,
  migrationhub: MigrationHubClient,
  dms: DatabaseMigrationServiceClient,
  snowball: SnowballClient,
  transfer: TransferClient,
  workspaces: WorkSpacesClient,
  appstream: AppStreamClient,
  workdocs: WorkDocsClient,
  braket: BraketClient,
  robomaker: RoboMakerClient,
  groundstation: GroundStationClient,
  efs: EFSClient,
  pinpoint: PinpointClient,
  gamelift: GameLiftClient,
  cognitoidentity: CognitoIdentityClient,
  neptune: NeptuneClient,
  opensearch: OpenSearchClient,
  lakeformation: LakeFormationClient,
  transcribe: TranscribeClient,
  polly: PollyClient,
  translate: TranslateClient,
  forecast: ForecastClient,
  kendra: KendraClient,
  personalize: PersonalizeClient,
  textract: TextractClient,
  eventbridge: EventBridgeClient,
  directoryservice: DirectoryServiceClient,
  acm: ACMClient,
  inspector: InspectorClient,
  macie: MacieClient,
  costexplorer: CostExplorerClient,
  appflow: AppFlowClient,
  sfn: SFNClient, // Step Functions
  lex: LexModelBuildingServiceClient, // Lex
};

const loadAWSClient = (service) => {
  const client = serviceClients[service.toLowerCase()];
  if (!client) {
    throw new Error(`Unsupported AWS service: ${service}`);
  }
  return client;
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Middleware to check for a valid Bearer Token
app.use((req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Bearer token" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  if (token !== process.env.BEARER_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  next(); // If token is valid, proceed to the next middleware/route handler
});

// Initialize AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Serve the ai-plugin.json from /.well-known
app.get("/.well-known/ai-plugin.json", (req, res) => {
  res.sendFile(path.join(__dirname, "ai-plugin.json"));
});

// Serve the openapi.json
app.get("/openapi.json", (req, res) => {
  res.sendFile(path.join(__dirname, "openapi.json"));
});

app.post("/aws-action", async (req, res) => {
  const { service, action, params } = req.body;

  if (!service || !action) {
    return res.status(400).json({ error: "Missing 'service' or 'action' in request body" });
  }

  try {
    // Load the appropriate AWS SDK client
    const AWSClient = loadAWSClient(service);
    const client = new AWSClient({ region: process.env.AWS_REGION });

    // Check if the action exists in the client
    if (typeof client[action] !== "function") {
      return res.status(400).json({ error: `Invalid action: ${action} for service: ${service}` });
    }

    // Dynamically invoke the action
    const command = new client[action](params); // Create the command with params
    const data = await client.send(command); // Send the command

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Plugin server running on port ${port}`);
});
