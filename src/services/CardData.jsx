const folderPic= "https://www.iconpacks.net/icons/2/free-folder-icon-1485-thumb.png"

const cardData = [
    {
      id: 1,
      title: "hiCard 1",
      description: "This is the description for card 1.",
      image: 'https://media.gettyimages.com/id/936714704/video/band-rehearsing-indoors.jpg?s=640x640&k=20&c=acD1YjnMOGmP2g4e774UC5sfxLBYMFr4XqjVyOcLvA4=',
      basicMetadata: {
        filename: "https://www.youtube.com/embed/fKsrERSd_Lo?si=YUgFNaJxGwiCzeE9",
        filesize: "120MB",
        format: "MP4"
      },
      streamMetadata: {
        codec: "H.264",
        resolution: "1920x1080",
        frameRate: "30fps",
        aspectRatio: "16:9",
        duration: "4 minutes 35 seconds",
      },
      descriptiveMetadata:{
        videoTitle: "Wildlife Documentary",
        author: "John Doe",
        copyrightClaimed: "Yes",
        description: "A short documentary showcasing wildlife in African safaris.",
        uploadDate: "2023-08-08"
      },
      folderORfile: "file",
      category:  "Dubbed serial"
    },
    {
      id: 2,
      title: "ydCard 2",
      description: "This is the description for card 2.",
      image: 'data:image/jpeg;base64,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',
      basicMetadata: {
        filename: "https://www.youtube.com/embed/yqHXl13SMr4?si=sk4vNA_ds0QAg896",
        filesize: "95MB",
        format: "MOV"
      },
      streamMetadata: {
        codec: "HEVC",
        resolution: "1280x720",
        frameRate: "60fps",
        aspectRatio: "16:9",
        duration: "2 minutes 10 seconds"
      },
      descriptiveMetadata: {
        videoTitle: "City Life Timelapse",
        author: "Jane Smith",
        copyrightClaimed: "No",
        description: "A high-speed timelapse of urban life over 24 hours.",
        uploadDate: "2023-11-15"
      },
      folderORfile: "file",
      category:  "Dubbed serial"
    },
    {
      id: 3,
      title: "dyCard 3",
      description: "This is the description for card 3.",
      image: folderPic,
      folderORfile: "folder"
      ,folderItems: []
    },
    {
        id: 4,
        title: "ftCard 4",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 5,
        title: "huCard 5",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 6,
        title: "aiCard 6",
        description: "This is the description for card 3.",
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzblF5FkPt_vf3WhEJzpThZSruBOVaqXCU_w&s',
        basicMetadata: {
            filename: "https://www.youtube.com/embed/rw_OgA9x7B8?si=Knh3PvYvglg82Xhe",
            filesize: "200MB",
            format: "AVI"
          },
          streamMetadata: {
            codec: "MPEG-4",
            resolution: "2560x1440",
            frameRate: "24fps",
            aspectRatio: "21:9",
            duration: "6 minutes 22 seconds"
          },
          descriptiveMetadata: {
            videoTitle: "Journey to Mars",
            author: "Astro Lab",
            copyrightClaimed: "Yes",
            description: "An educational video about Mars missions and discoveries.",
            uploadDate: "2024-01-03"
          },
        folderORfile: "file",
        category:  "cartoon"
    },
    {
        id: 7,
        title: "psCard 7",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 8,
        title: "ldCard 8",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 9,
        title: "syCard 9",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 10,
        title: "ljCard 10",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
       ,folderItems: []
    },
    {
        id: 11,
        title: "dgCard 11",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 12,
        title: "llCard 12",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 13,
        title: "oCard 13",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 14,
        title: "pCard 14",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
    {
        id: 15,
        title: "kCard 15",
        description: "This is the description for card 3.",
        image: folderPic,
        folderORfile: "folder"
        ,folderItems: []
    },
  ];
  
  export default cardData;
  