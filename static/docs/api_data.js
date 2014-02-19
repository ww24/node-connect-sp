define({ api: [
  {
    "type": "get",
    "url": "/connect",
    "title": "request connection",
    "group": "Connect",
    "name": "RequestConnection",
    "description": "スマートフォン接続のためにこの URL へリダイレクトさせます。",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "All",
            "type": "String",
            "field": "redirect",
            "optional": false,
            "description": "リダイレクト URL"
          },
          {
            "group": "All",
            "type": "String",
            "field": "room_param",
            "optional": true,
            "description": "redirect リダイレクト時に room_id を渡す param 名"
          }
        ]
      }
    },
    "filename": "routes/connect.js"
  },
  {
    "type": "socket.io",
    "url": "socket.emit(\"client\")",
    "title": "get client information",
    "group": "Room",
    "name": "Client",
    "description": "接続確認とクライアント情報の取得",
    "version": "0.0.1",
    "success": {
      "fields": {
        "StatusObject": [
          {
            "group": "All",
            "type": "String",
            "field": "status",
            "optional": false,
            "description": "[ok/ng] 接続後/接続前"
          },
          {
            "group": "All",
            "type": "String",
            "field": "room_id",
            "optional": false,
            "description": "ルーム固有の ID"
          },
          {
            "group": "All",
            "type": "Boolean",
            "field": "is_parent",
            "optional": false,
            "description": "親機判定"
          },
          {
            "group": "All",
            "type": "String",
            "field": "socket_id",
            "optional": false,
            "description": "Socket.IO の ID"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example",
        "content": "socket.emit(\"client\", function (client) {\n // 自分の情報を取得\n console.log(client);\n});\n"
      }
    ],
    "filename": "routes/room.js"
  },
  {
    "type": "socket.io",
    "url": "socket.emit(\"data\")",
    "title": "send sync data",
    "group": "Room",
    "name": "Data",
    "description": "汎用データの送信 (書式は任意)",
    "version": "0.0.1",
    "filename": "routes/room.js"
  },
  {
    "type": "socket.io",
    "url": "socket.on(\"room:data\")",
    "title": "receive sync data",
    "group": "Room",
    "name": "RoomData",
    "description": "汎用データの受信 (書式は任意)",
    "version": "0.0.1",
    "filename": "routes/room.js"
  },
  {
    "type": "socket.io",
    "url": "socket.on(\"room:player:add\")",
    "title": "receive player data",
    "group": "Room",
    "name": "RoomPlayerAdd",
    "description": "Player 情報の受信 (入室イベント)",
    "version": "0.0.1",
    "examples": [
      {
        "title": "Example",
        "content": "socket.on(\"room:player:add\", function (player) {\n // Player の情報を取得\n console.log(player);\n});\n"
      }
    ],
    "filename": "routes/room.js"
  },
  {
    "type": "socket.io",
    "url": "socket.on(\"room:player:remove\")",
    "title": "receive player data",
    "group": "Room",
    "name": "RoomPlayerRemove",
    "description": "Player 情報の受信 (退室イベント)",
    "version": "0.0.1",
    "examples": [
      {
        "title": "Example",
        "content": "socket.on(\"room:player:remove\", function (player) {\n // Player の情報を取得\n console.log(player);\n});\n"
      }
    ],
    "filename": "routes/index.js"
  }
] });