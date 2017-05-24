'use strict';

const {
  Draft,
  IPFSHash,
  contextIRI,
  contextPrefix,
  validateSchema
} = require('../lib/schema.js');

// @flow

/**
* @module constellate/src/meta
*/

const Album = {
  $schema: Draft,
  title: 'Album',
  type: 'object',
  properties: {
    '@context': {
      type: 'object',
      properties: {
        schema: {
          enum: ['http://schema.org/']
        },
        Album: contextPrefix('schema', 'MusicAlbum'),
        art: contextIRI('schema', 'image'),
        artist: contextIRI('schema', 'byArtist'),
        productionType: contextPrefix('schema', 'albumProductionType'),
        recordLabel: contextIRI('schema', 'recordLabel'),
        releaseType: contextPrefix('schema', 'albumReleaseType'),
        title: contextPrefix('schema', 'name'),
        track: contextIRI('schema', 'track')
      },
      readonly: true,
      required: [
        'schema',
        'Album',
        'art',
        'artist',
        'productionType',
        'recordLabel',
        'releaseType',
        'title',
        'track'
      ]
    },
    '@type': {
      enum: ['Album'],
      readonly: true
    },
    art: IPFSHash,
    artist: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    productionType: {
      enum: [
        'CompilationAlbum',
        'DemoAlbum',
        'DJMixAlbum',
        'LiveAlbum',
        'MixtapeAlbum',
        'RemixAlbum',
        'SoundtrackAlbum',
        'SpokenWordAlbum',
        'StudioAlbum'
      ]
    },
    recordLabel: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    releaseType: {
      enum: [
        'AlbumRelease',
        'BroadcastRelease',
        'EPRelease',
        'SingleRelease'
      ]
    },
    title: {
      type: 'string'
    },
    track: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    }
  },
  required: [
    '@context',
    '@type',
    'artist',
    'title',
    'track'
  ]
}

const AlbumContext = {
  schema: 'http://schema.org/',
  Album: 'schema:MusicAlbum',
  art: {
    '@id': 'schema:image',
    '@type': '@id'
  },
  artist: {
    '@id': 'schema:byArtist',
    '@type': '@id'
  },
  productionType: 'schema:albumProductionType',
  recordLabel: {
    '@id': 'schema:recordLabel',
    '@type': '@id'
  },
  releaseType: 'schema:albumReleaseType',
  title: 'schema:name',
  track: {
    '@id': 'schema:track',
    '@type': '@id'
  }
}

const Audio = {
  $schema: Draft,
  title: 'Audio',
  type: 'object',
  properties: {
    '@context': {
      type: 'object',
      properties: {
        schema: {
          enum: ['http://schema.org/']
        },
        Audio: contextPrefix('schema', 'AudioObject'),
        contentUrl: contextPrefix('schema', 'contentUrl'),
        encodingFormat: contextPrefix('schema', 'encodingFormat')
        //..
      },
      readonly: true,
      required: [
        'Audio',
        'contentUrl',
        'encodingFormat'
      ]
    },
    '@type': {
      enum: ['Audio'],
      readonly: true
    },
    contentUrl: IPFSHash,
    encodingFormat: {
      enum: ['mp3', 'mpeg4']
    }
    //..
  },
  require: [
    '@context',
    '@type',
    'contentUrl'
  ]
}

const AudioContext = {
  schema: 'http://schema.org/',
  Audio: 'schema:AudioObject',
  contentUrl: 'schema:contentUrl',
  encodingFormat: 'schema:encodingFormat'
}

const Composition = {
  $schema: Draft,
  title: 'Composition',
  type: 'object',
  properties: {
    '@context': {
      type: 'object',
      properties: {
        schema: {
          enum: ['http://schema.org/']
        },
        composer: contextIRI('schema', 'composer'),
        Composition: contextPrefix('schema', 'MusicComposition'),
        iswc: contextPrefix('schema', 'iswcCode'),
        lyricist: contextIRI('schema', 'lyricist'),
        publisher: contextIRI('schema', 'publisher'),
        title: contextPrefix('schema', 'name')
      },
      readonly: true,
      required: [
        'schema',
        'composer',
        'Composition',
        'iswc',
        'lyricist',
        'publisher',
        'title'
      ]
    },
    '@type': {
      enum: ['Composition'],
      readonly: true
    },
    composer: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    iswc: {
      type: 'string',
      pattern: 'T-[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]'
    },
    lyricist: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    publisher: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    title: {
      type: 'string'
    }
  },
  required: [
    '@context',
    '@type',
    'composer',
    'title'
  ]
}

const CompositionContext = {
  schema: 'http://schema.org/',
  composer: {
    '@id': 'schema:composer',
    '@type': '@id'
  },
  Composition: 'schema:MusicComposition',
  iswc: 'schema:iswcCode',
  lyricist: {
    '@id': 'schema:lyricist',
    '@type': '@id'
  },
  publisher: {
    '@id': 'schema:publisher',
    '@type': '@id'
  },
  title: 'schema:name'
}

const Image = {
  $schema: Draft,
  title: 'Image',
  type: 'object',
  properties: {
    '@context': {
      type: 'object',
      properties: {
        schema: {
          enum: ['http://schema.org/']
        },
        contentUrl: contextPrefix('schema', 'contentUrl'),
        Image: contextPrefix('schema', 'ImageObject'),
        encodingFormat: contextPrefix('schema', 'encodingFormat')
        //..
      },
      readonly: true,
      required: [
        'contentUrl',
        'Image',
        'encodingFormat'
      ]
    },
    '@type': {
      enum: ['Image'],
      readonly: true
    },
    contentUrl: IPFSHash,
    encodingFormat: {
      enum: ['jpeg', 'png']
    }
    //..
  },
  require: [
    '@context',
    '@type',
    'contentUrl'
  ]
}

const ImageContext = {
  schema: 'http://schema.org/',
  contentUrl: 'schema:contentUrl',
  Image: 'schema:ImageObject',
  encodingFormat: 'schema:encodingFormat'
}

const Recording = {
  $schema: Draft,
  title: 'Recording',
  type: 'object',
  properties: {
    '@context': {
      type: 'object',
      properties: {
        schema: {
          enum: ['http://schema.org/']
        },
        audio: contextIRI('schema', 'audio'),
        isrc: contextPrefix('schema', 'isrcCode'),
        performer: contextIRI('schema', 'performer'),
        producer: contextIRI('schema', 'producer'),
        Recording: contextPrefix('schema', 'MusicRecording'),
        recordingOf: contextIRI('schema', 'recordingOf'),
        recordLabel: contextIRI('schema', 'recordLabel'),
        title: contextPrefix('schema', 'name')
      },
      readonly: true,
      required: [
        'schema',
        'audio',
        'isrc',
        'performer',
        'producer',
        'Recording',
        'recordingOf',
        'recordLabel',
        'title'
      ]
    },
    '@type': {
      enum: ['Recording'],
      readonly: true
    },
    audio: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    isrc: {
      type: 'string',
      pattern: '^[A-Z]{2}-[A-Z0-9]{3}-[7890][0-9]-[0-9]{5}$'
    },
    performer: {
      type: 'array',
      items:  IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    producer: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    recordingOf: IPFSHash,
    recordLabel: {
      type: 'array',
      items: IPFSHash,
      minItems: 1,
      uniqueItems: true
    },
    title: {
      type: 'string'
    }
  },
  required: [
    '@context',
    '@type',
    'audio',
    'performer',
    'recordingOf'
  ]
}

const RecordingContext = {
  schema: 'http://schema.org/',
  audio: {
    '@id': 'schema:audio',
    '@type': '@id'
  },
  isrc: 'schema:isrcCode',
  performer: {
    '@id': 'schema:performer',
    '@type': '@id'
  },
  producer: {
    '@id': 'schema:producer',
    '@type': '@id'
  },
  Recording: 'schema:MusicRecording',
  recordingOf: {
    '@id': 'schema:recordingOf',
    '@type': '@id'
  },
  recordLabel: {
    '@id': 'schema:recordLabel',
    '@type': '@id'
  },
  title: 'schema:name'
}

function getMetaSchema(type: string): Object {
  switch(type) {
    case 'Album':
      return Album;
    case 'Audio':
      return Audio;
    case 'Composition':
      return Composition;
    case 'Image':
      return Image;
    case 'Recording':
      return Recording;
    default:
      throw new Error('unexpected meta @type: ' + type);
  }
}

function validateMeta(meta: Object): boolean {
  const schema = getMetaSchema(meta['@type']);
  if (!validateSchema(meta, schema)) {
    throw new Error('meta has invalid schema: ' + JSON.stringify(meta, null, 2));
  }
  return true;
}

exports.AlbumContext = AlbumContext;
exports.AudioContext = AudioContext;
exports.CompositionContext = CompositionContext;
exports.ImageContext = ImageContext;
exports.RecordingContext = RecordingContext;
exports.getMetaSchema = getMetaSchema;
exports.validateMeta = validateMeta;
