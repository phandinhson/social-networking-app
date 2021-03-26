const flatten = arr2D => arr2D.reduce((a, b) => [...a, ...b], []);
export default flatten;