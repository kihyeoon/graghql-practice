import { graphql } from "@octokit/graphql";
import { useEffect, useState } from "react";

const { REACT_APP_GITHUB_AGORA_STATES_TOKEN, NODE_ENV } = process.env;

function App() {
  const [data, setData] = useState();
  const [viewer, setViewer] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  async function repo() {
    let token;
    if (NODE_ENV === "development" || NODE_ENV === "test") {
      token = REACT_APP_GITHUB_AGORA_STATES_TOKEN;
    }

    const { repository, viewer } = await graphql(
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
          viewer {
            login
            avatarUrl
          }
        }
      `,
      {
        headers: {
          authorization: `token ${token}`,
        },
      }
    );
    return { repository, viewer };
  }

  useEffect(() => {
    repo()
      .then((data) => {
        setData(data.repository);
        setViewer(data.viewer);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(Error, error);
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
          })(
            <div className="avatar--wrapper">
              <img src={viewer.avatarUrl} alt={`avatar of ${viewer.login}`} />
              <span>{viewer.login}</span>
            </div>
          )}
    </div>
  );
}

export default App;
