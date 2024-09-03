export type RaiseContract = {
  "version": "0.1.0",
  "name": "raise_contract",
  "constants": [
    {
      "name": "SEED",
      "type": "string",
      "value": "\"anchor\""
    }
  ],
  "instructions": [
    {
      "name": "initializePlatform",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "platform",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "platformAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializePlatformArgs"
          }
        }
      ]
    },
    {
      "name": "setPlatformAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "platform",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "SetPlatformAdminArgs"
          }
        }
      ]
    },
    {
      "name": "setPlatformFee",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "platform",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "SetPlatformFeeArgs"
          }
        }
      ]
    },
    {
      "name": "initializeCampaign",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaign",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeCampaignArgs"
          }
        }
      ]
    },
    {
      "name": "fundToCampaign",
      "accounts": [
        {
          "name": "donor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaign",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "donorInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "FundToCampaignArgs"
          }
        }
      ]
    },
    {
      "name": "withdrawFromCampaign",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaign",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "refundToDonor",
      "accounts": [
        {
          "name": "donor",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaign",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "donorInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setCampaignUnlocked",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaign",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "platform",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "feeAccumulated",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "authorityBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "endingTimestamp",
            "type": "i64"
          },
          {
            "name": "minimumDepositAmount",
            "type": "u64"
          },
          {
            "name": "raisedAmount",
            "type": "u64"
          },
          {
            "name": "isWithdrawn",
            "type": "bool"
          },
          {
            "name": "isLocked",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "campaignAuthority",
            "type": "publicKey"
          },
          {
            "name": "campaignAuthorityBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "donor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "donor",
            "type": "publicKey"
          },
          {
            "name": "campaign",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "donorBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FundToCampaignArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fundAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeCampaignArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "campaignDuration",
            "type": "i64"
          },
          {
            "name": "minDepositAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializePlatformArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetPlatformAdminArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminToBeChanged",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "SetPlatformFeeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feeToBeChanged",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CampaignDurationTooLow",
      "msg": "CampaignDurationTooLow"
    },
    {
      "code": 6001,
      "name": "FundAmountTooLow",
      "msg": "FundAmountTooLow"
    },
    {
      "code": 6002,
      "name": "CampaignGoalReached",
      "msg": "CampaignGoalReached"
    },
    {
      "code": 6003,
      "name": "CampaignEnded",
      "msg": "CampaignEnded"
    },
    {
      "code": 6004,
      "name": "CampaignFundAlreadyWithdrawn",
      "msg": "CampaignFundAlreadyWithdrawn"
    },
    {
      "code": 6005,
      "name": "CampaignGoalNotReached",
      "msg": "CampaignGoalNotReached"
    },
    {
      "code": 6006,
      "name": "CampaignFundDurationNotEnded",
      "msg": "CampaignFundDurationNotEnded"
    },
    {
      "code": 6007,
      "name": "CampaignIsOnProgress",
      "msg": "CampaignIsOnProgress"
    }
  ]
};

export const IDL: RaiseContract = {
  "version": "0.1.0",
  "name": "raise_contract",
  "constants": [
    {
      "name": "SEED",
      "type": "string",
      "value": "\"anchor\""
    }
  ],
  "instructions": [
    {
      "name": "initializePlatform",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "platform",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "platformAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializePlatformArgs"
          }
        }
      ]
    },
    {
      "name": "setPlatformAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "platform",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "SetPlatformAdminArgs"
          }
        }
      ]
    },
    {
      "name": "setPlatformFee",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "platform",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "SetPlatformFeeArgs"
          }
        }
      ]
    },
    {
      "name": "initializeCampaign",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaign",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeCampaignArgs"
          }
        }
      ]
    },
    {
      "name": "fundToCampaign",
      "accounts": [
        {
          "name": "donor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaign",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "donorInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "FundToCampaignArgs"
          }
        }
      ]
    },
    {
      "name": "withdrawFromCampaign",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaign",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "refundToDonor",
      "accounts": [
        {
          "name": "donor",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK"
          ]
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaign",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "campaignAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "donorInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setCampaignUnlocked",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaign",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "platform",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "feeAccumulated",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "authorityBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "endingTimestamp",
            "type": "i64"
          },
          {
            "name": "minimumDepositAmount",
            "type": "u64"
          },
          {
            "name": "raisedAmount",
            "type": "u64"
          },
          {
            "name": "isWithdrawn",
            "type": "bool"
          },
          {
            "name": "isLocked",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "campaignAuthority",
            "type": "publicKey"
          },
          {
            "name": "campaignAuthorityBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "donor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "donor",
            "type": "publicKey"
          },
          {
            "name": "campaign",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "donorBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FundToCampaignArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fundAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeCampaignArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "campaignDuration",
            "type": "i64"
          },
          {
            "name": "minDepositAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializePlatformArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetPlatformAdminArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminToBeChanged",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "SetPlatformFeeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feeToBeChanged",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CampaignDurationTooLow",
      "msg": "CampaignDurationTooLow"
    },
    {
      "code": 6001,
      "name": "FundAmountTooLow",
      "msg": "FundAmountTooLow"
    },
    {
      "code": 6002,
      "name": "CampaignGoalReached",
      "msg": "CampaignGoalReached"
    },
    {
      "code": 6003,
      "name": "CampaignEnded",
      "msg": "CampaignEnded"
    },
    {
      "code": 6004,
      "name": "CampaignFundAlreadyWithdrawn",
      "msg": "CampaignFundAlreadyWithdrawn"
    },
    {
      "code": 6005,
      "name": "CampaignGoalNotReached",
      "msg": "CampaignGoalNotReached"
    },
    {
      "code": 6006,
      "name": "CampaignFundDurationNotEnded",
      "msg": "CampaignFundDurationNotEnded"
    },
    {
      "code": 6007,
      "name": "CampaignIsOnProgress",
      "msg": "CampaignIsOnProgress"
    }
  ]
};