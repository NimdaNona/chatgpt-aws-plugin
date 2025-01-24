require("dotenv").config(); // loads local .env if present
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// AWS SDK v3
const {
  S3Client,
  DynamoDBClient,
  LambdaClient,
  EC2Client,
  LightsailClient,
  BatchClient,
  ElasticBeanstalkClient,
  OutpostsClient,
  FSxClient,
  GlacierClient,
  StorageGatewayClient,
  RDSClient,
  RedshiftClient,
  ElastiCacheClient,
  Route53Client,
  CloudFrontClient,
  DirectConnectClient,
  GlobalAcceleratorClient,
  ElasticLoadBalancingClient,
  EMRClient,
  KinesisClient,
  GlueClient,
  QuickSightClient,
  AthenaClient,
  ECSClient,
  ECRClient,
  FirehoseClient,
  SecretsManagerClient,
  SSMClient,
  SESClient,
  AmplifyClient,
  IAMClient,
  GuardDutyClient,
  ShieldClient,
  WAFClient,
  KMSClient,
  SageMakerClient,
  RekognitionClient,
  CodeCommitClient,
  CodeBuildClient,
  CodeDeployClient,
  CodePipelineClient,
  Cloud9Client,
  CloudFormationClient,
  CloudTrailClient,
  CloudWatchClient,
  ConfigServiceClient,
  SQSClient,
  SNSClient,
  MQClient,
  IoTClient,
  MediaConvertClient,
  MediaLiveClient,
  MediaPackageClient,
  MediaStoreClient,
  MigrationHubClient,
  DatabaseMigrationServiceClient,
  SnowballClient,
  TransferClient,
  WorkSpacesClient,
  AppStreamClient,
  WorkDocsClient,
  BraketClient,
  RoboMakerClient,
  GroundStationClient,
  EFSClient,
  PinpointClient,
  GameLiftClient,
  CognitoIdentityClient,
  NeptuneClient,
  OpenSearchClient,
  LakeFormationClient,
  TranscribeClient,
  PollyClient,
  TranslateClient,
  ForecastClient,
  KendraClient,
  PersonalizeClient,
  TextractClient,
  EventBridgeClient,
  DirectoryServiceClient,
  ACMClient,
  InspectorClient,
  MacieClient,
  CostExplorerClient,
  AppFlowClient,
  SFNClient, // Step Functions
  LexModelBuildingServiceClient, // Lex
} = require("@aws-sdk/client-*");
 // Note: Install required clients

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

// Create S3 Bucket endpoint
app.post("/create-s3-bucket", async (req, res) => {
  const { bucketName } = req.body;
  if (!bucketName) {
    return res.status(400).json({
      success: false,
      message: "Missing 'bucketName' in request body",
    });
  }

  try {
    const command = new CreateBucketCommand({ Bucket: bucketName });
    await s3Client.send(command);
    res.json({
      success: true,
      message: `Bucket '${bucketName}' created successfully.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List S3 buckets endpoint
app.get("/list-s3-buckets", async (req, res) => {
  try {
    const command = new ListBucketsCommand({});
    const data = await s3Client.send(command);
    const bucketNames = data.Buckets.map(b => b.Name);

    res.json({ buckets: bucketNames });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Plugin server running on port ${port}`);
});
