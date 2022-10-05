import { graphql } from "@octokit/graphql";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  async function repo() {
    const { repository } = await graphql(
      /* 아래는 요청할 쿼리가 들어가는 영역 */
      `
        {
          repository(owner: "codestates-seb", name: "agora-states-fe") {
            discussions(first: 10) {
              edges {
                node {
                  title
                  url
                  author {
                    resourcePath
                  }
                }
              }
            }
          }
        }
      `,
      {
        headers: {
          authorization: `token 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`,
        },
      }
    );
    return repository;
  }

  useEffect(() => {
    repo().then((res) => {
      console.log(res);
      setData(res.discussions.edges);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="App">
      {isLoading
        ? "loading..."
        : data.map((el, index) => {
            return (
              <li key={index}>
                <a href={el.node.url}>{el.node.title}</a>
                <span>{el.node.author.resourcePath}</span>
              </li>
            );
          })}
    </div>
  );
}

export default App;
