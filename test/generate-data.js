const { writeTestFile } = require('./fs.js');
const { promiseSeq } = require('../lib/util.js');

const {
  calcHash,
  putDAGNode,
  startPeer
} = require('../lib/ipfs.js');

const hashes = {};
const objs = {};

function setHash(name) {
    // return calcHash(objs[name], 'dag-cbor').then((hash) => {
    //    return hashes[name] = hash;
    // });
    return putDAGNode(objs[name], 'dag-cbor').then((cid) => {
      return hashes[name] = cid.toBaseEncodedString();
    })
}

objs.composer = {
    '@context': 'http://schema.org/',
    '@type': 'Person',
    email: 'composer@example.com',
    name: 'composer',
    url: 'http://composer.com'
}

objs.lyricist = {
    '@context': 'http://schema.org/',
    '@type': 'Person',
    email: 'lyricist@example.com',
    name: 'lyricist',
    url: 'http://lyricist.com'
}

objs.performer = {
    '@context': 'http://schema.org/',
    '@type': 'MusicGroup',
    email: 'performer@example.com',
    name: 'performer',
    sameAs: ['http://bandcamp-page.com'],
    url: 'http://performer.com'
}

objs.producer = {
    '@context': 'http://schema.org/',
    '@type': 'Person',
    name: 'producer',
    sameAs: ['http://soundcloud-page.com'],
    url: 'http://producer.com'
}

objs.publisher = {
    '@context': 'http://schema.org/',
    '@type': 'Organization',
    email: 'publisher@example.com',
    name: 'publisher',
    url: 'http://publisher.com'
}

objs.recordLabel = {
    '@context': 'http://schema.org/',
    '@type': 'Organization',
    email: 'recordLabel@example.com',
    name: 'recordLabel',
    url: 'http://recordLabel.com'
}

writeTestFile('/party/composer.json', JSON.stringify(objs.composer));
writeTestFile('/party/lyricist.json', JSON.stringify(objs.lyricist));
writeTestFile('/party/performer.json', JSON.stringify(objs.performer));
writeTestFile('/party/producer.json', JSON.stringify(objs.producer));
writeTestFile('/party/publisher.json', JSON.stringify(objs.publisher));
writeTestFile('/party/recordLabel.json', JSON.stringify(objs.recordLabel));

promiseSeq(
    startPeer,
    () => setHash('composer'),
    () => setHash('lyricist'),
    () => setHash('performer'),
    () => setHash('producer'),
    () => setHash('publisher'),
    () => setHash('recordLabel')

).then(() => {

    objs.audio = {
        '@context': 'http://schema.org/',
        '@type': 'AudioObject',
        contentUrl:  { '/': 'QmYKAhVW2d4e28a7HezzFtsCZ9qsqwv6mrqELrAkrAAwfE' },
        encodingFormat: 'mp3'
    }

    objs.composition = {
        '@context': 'http://schema.org/',
        '@type': 'MusicComposition',
        composer: [{ '/': hashes.composer }],
        iswcCode: 'T-034.524.680-1',
        lyricist: [{ '/': hashes.lyricist }],
        name: 'song-title',
        publisher: [{ '/': hashes.publisher }]
    }

    objs.image = {
        '@context': 'http://schema.org/',
        '@type': 'ImageObject',
        contentUrl: { '/': 'QmYKAhvW2d4f28a7HezzFtsCZ9qsqwv6mrqELrAkrAAwfE' },
        encodingFormat: 'png'
    }

    writeTestFile('/meta/composition.json', JSON.stringify(objs.composition));
    writeTestFile('/meta/audio.json', JSON.stringify(objs.audio));
    writeTestFile('/meta/image.json', JSON.stringify(objs.image));

    return promiseSeq(
        () => setHash('audio'),
        () => setHash('composition'),
        () => setHash('image')
    );

}).then(() => {

    objs.recording = {
        '@context': 'http://schema.org/',
        '@type': 'MusicRecording',
        audio: [{ '/': hashes.audio }],
        performer: [{ '/': hashes.performer }],
        producer: [{ '/': hashes.producer }],
        recordingOf: { '/': hashes.composition },
        recordLabel: [{ '/': hashes.recordLabel }]
    }

    writeTestFile('/meta/recording.json', JSON.stringify(objs.recording));

    return setHash('recording');

}).then(() => {

    objs.album = {
        '@context': 'http://schema.org/',
        '@type': 'MusicAlbum',
        albumProductionType: 'DemoAlbum',
        albumReleaseType: 'SingleRelease',
        byArtist: [
          { '/': hashes.performer },
          { '/': hashes.producer }
        ],
        image: { '/': hashes.image },
        name: 'ding-ding-dooby-doo',
        recordLabel: [{ '/': hashes.recordLabel }],
        track: [{ '/': hashes.recording }]
    }

    writeTestFile('/meta/album.json', JSON.stringify(objs.album));

    return setHash('album');

}).then(() => {

  objs.compositionCopyright = {
    '@context': 'http://coalaip.org/',
    '@type': 'Copyright',
    rightsOf: { '/': hashes.composition },
    validFrom: '2018-01-01T00:00:00Z',
    validThrough: '2088-01-01T00:00:00Z'
  }

  objs.compositionLicense = {
    '@context': 'http://schema.org/',
    '@type': 'CreativeWork',
    text: 'some text for composition license...'
  }

  objs.compositionRightContract = {
    '@context': 'http://schema.org/',
    '@type': 'CreativeWork',
    text: 'some text saying composition right is assigned to publisher...'
  }

  objs.recordingCopyright = {
    '@context': 'http://coalaip.org/',
    '@type': 'Copyright',
    rightsOf: { '/': hashes.recording },
    validFrom: '2017-10-01T00:00:00Z',
    validTo: '2076-10-01T00:00:00Z'
  }

  objs.recordingLicense = {
    '@context': 'http://schema.org/',
    '@type': 'CreativeWork',
    text: 'some text for recording license...'
  }

  objs.recordingRightContract =  {
    '@context': 'http://schema.org/',
    '@type': 'CreativeWork',
    text: 'some text saying recording right is assigned to record label...'
  }

  writeTestFile('/coala/composition-copyright.json', JSON.stringify(objs.compositionCopyright));
  writeTestFile('/coala/composition-license.json', JSON.stringify(objs.compositionLicense));
  writeTestFile('/coala/composition-right-contract.json', JSON.stringify(objs.compositionRightContract));

  writeTestFile('/coala/recording-copyright.json', JSON.stringify(objs.recordingCopyright));
  writeTestFile('/coala/recording-license.json', JSON.stringify(objs.recordingLicense));
  writeTestFile('/coala/recording-right-contract.json', JSON.stringify(objs.recordingRightContract));

  return promiseSeq(
    () => setHash('compositionCopyright'),
    () => setHash('compositionLicense'),
    () => setHash('compositionRightContract'),
    () => setHash('recordingCopyright'),
    () => setHash('recordingLicense'),
    () => setHash('recordingRightContract')
  );

}).then(() => {

  objs.compositionCopyrightAssertion = {
    '@context': [
      'http://schema.org/',
      'http://coalaip.org/'
    ],
    '@type': 'ReviewAction',
    asserter: { '/': hashes.composer },
    assertionSubject: { '/': hashes.compositionCopyright },
    assertionTruth: true
  }

  objs.compositionRight = {
    '@context': [
      'http://schema.org/',
      'http://coalaip.org/'
    ],
    '@type': 'Right',
    exclusive: true,
    license: { '/': hashes.compositionLicense },
    percentageShares: 70,
    rightContext: ['commercial'],
    usageType: ['publish'],
    source: { '/': hashes.compositionCopyright },
    validFrom: '2018-01-01T00:00:00Z',
    validThrough: '2068-01-01T00:00:00Z'
  }

  objs.compositionRightAssignment = {
    '@context': 'http://coalaip.org/',
    '@type': 'RightsTransferAction',
    transferContract: { '/': hashes.compositionRightContract }
  }

  objs.recordingCopyrightAssertion = {
    '@context': [
      'http://schema.org/',
      'http://coalaip.org/'
    ],
    '@type': 'ReviewAction',
    asserter: { '/': hashes.recordLabel },
    assertionSubject: { '/': hashes.recordingCopyright },
    assertionTruth: false,
    error: 'copyrightHolder'
  }

  objs.recordingRight = {
    '@context': [
      'http://schema.org/',
      'http://coalaip.org/'
    ],
    '@type': 'Right',
    exclusive: true,
    license: { '/': hashes.recordingLicense },
    percentageShares: 60,
    rightContext: ['commercial'],
    usageType: ['play', 'sell'],
    source: { '/': hashes.recordingCopyright },
    validFrom: '2017-10-01T00:00:00Z',
    validThrough: '2057-10-01T00:00:00Z'
  }

  objs.recordingRightAssignment = {
    '@context': 'http://coalaip.org/',
    '@type': 'RightsTransferAction',
    transferContract: { '/': hashes.recordingRightContract }
  }

  writeTestFile('/coala/composition-copyright-assertion.json', JSON.stringify(objs.compositionCopyrightAssertion));
  writeTestFile('/coala/composition-right.json', JSON.stringify(objs.compositionRight));
  writeTestFile('/coala/composition-right-assignment.json', JSON.stringify(objs.compositionRightAssignment));
  writeTestFile('/coala/recording-copyright-assertion.json', JSON.stringify(objs.recordingCopyrightAssertion));
  writeTestFile('/coala/recording-right.json', JSON.stringify(objs.recordingRight));
  writeTestFile('/coala/recording-right-assignment.json', JSON.stringify(objs.recordingRightAssignment));

  return promiseSeq(
    () => setHash('compositionCopyrightAssertion'),
    () => setHash('compositionRight'),
    () => setHash('compositionRightAssignment'),
    () => setHash('recordingCopyrightAssertion'),
    () => setHash('recordingRight'),
    () => setHash('recordingRightAssignment')
  );

}).then(() => console.log('done'));