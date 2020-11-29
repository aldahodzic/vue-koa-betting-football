import moment from "dayjs";

export const config = {
  isActivated: false,
  matchesCount: 40,
  matchesCountPerDay: 5,
  minCoefficient: 1,
  maxCoefficient: 4,
  bookmakersCount: 4,
};

export function activateGenerationMode () {
  config.isActivated = true;
}

export function generateMatches (leagues) {
  const matches = [];

  for (let i = 1; i <= config.matchesCount; i += 2) {
    const coefficients = [0, 1, 2].reduce((cs, c) => ({
      ...cs,
      [c]: new Array(config.bookmakersCount).fill(null).map((_, index) => ({
        name: `Bookmaker-${index + 1}`,
        coefficient: parseFloat(
          (Math.random() * config.maxCoefficient + config.minCoefficient).toFixed(2),
        ),
      })),
    }), {});

    const days = Math.floor(((i - 1) / 2) / config.matchesCountPerDay);
    const date = moment().add(days, "day");
    const year = date.year();
    const month = date.month();
    const day = date.date();
    const dateStamp = (new Date(year, month, day).getTime());

    leagues.forEach(league => {
      matches.push({
        key: `${league}:team${i}-team${i + 1}`,
        home: `Team ${i}`,
        guest: `Team ${i + 1}`,
        league,
        date: dateStamp,
        coefficients,
      });
    });
  }

  return matches;
}

export function confirmBetSlip (betSlip) {
  const betSlips = JSON.parse(sessionStorage.getItem("current-bet-slips")) || [];

  betSlip._id = Math.random().toString(36).slice(2);
  betSlip.createdAt = new Date().toJSON();
  betSlip.updatedAt = new Date().toJSON();
  betSlips.push(betSlip);

  sessionStorage.setItem("current-bet-slips", JSON.stringify(betSlips));
}

export function generateResults () {
  const betSlips = JSON.parse(sessionStorage.getItem("current-bet-slips")) || [];

  betSlips.forEach(betSlip => {
    betSlip.bets.forEach(bet => {
      bet.score = `${Math.round(Math.random() * 5)} : ${Math.round(Math.random() * 5)}`;
    });
  });

  return betSlips;
}
