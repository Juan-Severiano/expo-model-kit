
# Verifique se o GitHub CLI está instalado
# if ! command -v gh &> /dev/null; then
#   echo "🚫 GitHub CLI (gh) não encontrado. Instale-o primeiro: https://cli.github.com/"
#   exit 1
# fi

# Nome do repositório
REPO="Juan-Severiano/expo-model-kit"

echo "📦 Criando issues iniciais no repositório $REPO..."

# Array de issues
issues=(
  "Setup project structure | Configure folders: src/decorators, src/orm, src/hooks, src/viewmodel"
  "Implement @Model and @Field decorators | Use reflect-metadata to store schema metadata"
  "Create SQLite engine | Auto-generate tables based on @Model metadata using expo-sqlite"
  "Create ORM operations: insert, findAll, update, delete"
  "Implement @Query decorator for reactive model lists"
  "Create useViewModel hook to hydrate and bind @Query fields"
  "Add Zustand integration for state reactivity"
  "Create example model: Car with name and year"
  "Build example screen using FlatList to render data from useViewModel"
  "Write README.md with installation, usage, and model definitions"
  "Add tsup build config for library output"
  "Setup package.json with main/types/files for NPM publish"
  "Create .npmignore to exclude example and source files"
  "Add NPM scripts: build, dev, prepublishOnly"
  "Optional: Implement @PrimaryKey, @Default, and @Relation decorators"
)

# Criar as issues
for issue in "${issues[@]}"
do
  title="${issue%%|*}"
  body="${issue#*| }"

  echo "📌 Criando issue: $title"
  gh issue create --repo "$REPO" --title "$title" --body "$body" --label "enhancement"
done

echo "✅ Todas as issues foram criadas com sucesso."
