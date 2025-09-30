const calculateAge = (dateOfBirth) => {
  const today = new Date();

  const birthDate = new Date(dateOfBirth);

  let ageNumber = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    ageNumber--;
  }

  return ageNumber;
};

function constructFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

module.exports = { calculateAge, constructFullName };
