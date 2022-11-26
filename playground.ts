import dump from "./src/tools/dump";
import parse from "./src/compiler/parse";

const useCase = "<div>Hi!<p>Vue</p></div>";

dump(parse(useCase));
