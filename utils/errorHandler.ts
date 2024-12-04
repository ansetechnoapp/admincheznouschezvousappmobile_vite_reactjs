export const handleError = (error: any, customMessage: string) => {
    console.error(customMessage, error);
    throw new Error(customMessage);
  };
  