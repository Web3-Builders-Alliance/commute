export const IDLSellerProgram = 
{
  "version": "0.1.0",
  "name": "program_marketplace",
  "instructions": [
    {
      "name": "initializeSellerProgram",
      "accounts": [
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sellerProgram",
          "isMut": true,
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
          "name": "programId",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeAccessPda",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sellerProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "accessPda",
          "isMut": true,
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
          "name": "programId",
          "type": "publicKey"
        },
        {
          "name": "trial",
          "type": "bool"
        }
      ]
    },
    {
      "name": "closeExpiredAccess",
      "accounts": [
        {
          "name": "closer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "accessPda",
          "isMut": true,
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
      "name": "AccessPda",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "buyer",
            "type": "publicKey"
          },
          {
            "name": "accessPdaBump",
            "type": "u8"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "SellerProgram",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "seller",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "sellerProgramBump",
            "type": "u8"
          }
        ]
      }
    }
  ]
}