export const DEFAULT_TEAMS = [
  {id:'d1', name:'NeuralNinjas',   project:'MindBridge AI', district:'AI',         commits:247,quality:94,docs:88,testing:91,collab:95,innovation:98,members:4},
  {id:'d2', name:'DeepDreamers',   project:'VisionOS',      district:'AI',         commits:189,quality:87,docs:72,testing:85,collab:88,innovation:92,members:3},
  {id:'d3', name:'AlgoAlpha',      project:'PredictX',      district:'AI',         commits:156,quality:81,docs:79,testing:77,collab:82,innovation:85,members:5},
  {id:'d4', name:'ByteMinds',      project:'SentimentIQ',   district:'AI',         commits:134,quality:76,docs:65,testing:70,collab:79,innovation:78,members:3},
  {id:'d5', name:'PixelCraft',     project:'FlowUI',        district:'WEB',        commits:221,quality:91,docs:95,testing:88,collab:93,innovation:90,members:4},
  {id:'d6', name:'CodeCanvas',     project:'WebWeave',      district:'WEB',        commits:198,quality:85,docs:82,testing:86,collab:87,innovation:84,members:4},
  {id:'d7', name:'StackSorcerers', project:'NexusAPI',      district:'WEB',        commits:167,quality:88,docs:71,testing:82,collab:76,innovation:80,members:3},
  {id:'d8', name:'DevDynasty',     project:'GridMaster',    district:'WEB',        commits:143,quality:74,docs:68,testing:65,collab:72,innovation:73,members:5},
  {id:'d9', name:'AppArchitects',  project:'PocketOS',      district:'MOBILE',     commits:203,quality:89,docs:91,testing:93,collab:90,innovation:93,members:4},
  {id:'d10',name:'SwipeStudio',    project:'GestureFlow',   district:'MOBILE',     commits:177,quality:83,docs:76,testing:80,collab:85,innovation:87,members:3},
  {id:'d11',name:'MobileMinds',    project:'QuickLaunch',   district:'MOBILE',     commits:145,quality:79,docs:70,testing:74,collab:81,innovation:76,members:4},
  {id:'d12',name:'NativeNexus',    project:'CrossBridge',   district:'MOBILE',     commits:122,quality:71,docs:62,testing:68,collab:75,innovation:70,members:3},
  {id:'d13',name:'ChainChampions', project:'DecentralX',    district:'BLOCKCHAIN', commits:234,quality:92,docs:85,testing:89,collab:91,innovation:95,members:4},
  {id:'d14',name:'TokenTitans',    project:'CryptoVault',   district:'BLOCKCHAIN', commits:186,quality:86,docs:78,testing:83,collab:84,innovation:88,members:3},
  {id:'d15',name:'BlockBuilders',  project:'SmartCore',     district:'BLOCKCHAIN', commits:159,quality:82,docs:74,testing:78,collab:80,innovation:82,members:5},
  {id:'d16',name:'LedgerLabs',     project:'AuditChain',    district:'BLOCKCHAIN', commits:128,quality:75,docs:67,testing:72,collab:78,innovation:74,members:3},
]

export const DISTRICTS = {
  AI:         { hex:'#38bdf8', col:0x38bdf8, em:0x0369a1, label:'AI District',          cx:-105, cz:-105 },
  WEB:        { hex:'#f472b6', col:0xf472b6, em:0x9d174d, label:'Web District',          cx: 105, cz:-105 },
  MOBILE:     { hex:'#4ade80', col:0x4ade80, em:0x166534, label:'Mobile District',       cx:-105, cz: 105 },
  BLOCKCHAIN: { hex:'#fbbf24', col:0xfbbf24, em:0x92400e, label:'Blockchain District',   cx: 105, cz: 105 },
}

export const calcScore = (t) =>
  t.commits / 250 * 40 + t.quality / 100 * 30 + t.innovation / 100 * 30
