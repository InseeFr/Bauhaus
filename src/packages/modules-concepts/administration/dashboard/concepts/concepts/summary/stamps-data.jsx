export const buildDataStamps = (d) =>
  d.reduce((_, c) => {
    /*Init array element with stamp*/
    if (!_.filter((e) => e.stamp === c.creator).length)
      _.push({
        stamp: c.creator,
        total: 0,
        generic: 0,
        specific: 0,
        private: 0,
      });
    /*Increase values*/
    _.find((e) => e.stamp === c.creator).total++;
    if (c.disseminationStatus.endsWith("PublicGenerique"))
      _.find((e) => e.stamp === c.creator).generic++;
    if (c.disseminationStatus.endsWith("PublicSpecifique"))
      _.find((e) => e.stamp === c.creator).specific++;
    if (c.disseminationStatus.endsWith("Prive")) _.find((e) => e.stamp === c.creator).private++;
    return _;
  }, []); // sort by stamp
