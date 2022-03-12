const inset = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const SafeAreaConsumer = ({ children }) => {
  return children(inset);
};

export const useSafeArea = jest.fn(async () => {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
});

export default {
  useSafeArea: jest.fn(_ => { return { top: 10 }; }),
};
