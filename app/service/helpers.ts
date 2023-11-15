type NamedEntity = {
  name: string;
  [key: string]: any;
};

type Data = {
  continents: NamedEntity[] | null;
  countries: NamedEntity[] | null;
  languages: NamedEntity[] | null;
};

export const getUniqueNames = (data: Data): string[] => {
  const names = new Set<string>();

  const addNames = (entities: NamedEntity[] | null) => {
    if (entities) {
      entities.forEach(entity => {
        if (entity.name) {
          names.add(entity.name);
        }
      });
    }
  };

  addNames(data.continents);
  addNames(data.countries);
  addNames(data.languages);

  return Array.from(names);
}
