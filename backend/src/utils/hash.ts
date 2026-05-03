const random = (len: number): string => {
  let chars = "aB7_z3x-M9q~n5Y.r2Th8Jk0cL4PuVw6DeFg";
  let hash = "";
  for (let i = 0; i <= len; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }

  return hash;
};

export default random;
