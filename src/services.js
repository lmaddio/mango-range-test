export async function fetchMinMaxRange() {
  try {
    const response = await fetch("http://demo9098812.mockable.io/min-max-range");

    return await response.json();
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function fetchFixedRange() {
  try {
    const response = await fetch("http://demo9098812.mockable.io/fixed-range-list");

    return await response.json();
  } catch (error) {
    console.error(error);

    return null;
  }
}