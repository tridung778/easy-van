import { useState, ChangeEvent } from "react";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { tachAm } from "tieng-viet-tach-am";

function App() {
  const [text, setText] = useState("");
  const [highlightedText, setHighlightedText] = useState("");

  // Hàm loại dấu tiếng Việt
  function removeVietnameseTones(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Hàm lấy vần tiếng Việt thủ công (từ nguyên âm đầu tiên đến hết)
  function getVan(word: string) {
    const w = removeVietnameseTones(word.toLowerCase());
    const match = w.match(/[aeiouyăâêôơư]/);
    if (!match) return w;
    const idx = match.index;
    return w.slice(idx);
  }

  // Hàm tách từ tiếng Việt, giữ dấu câu, xuống dòng
  function tokenize(input: string) {
    return (
      input.match(/\n|[a-zA-ZÀ-ỹà-ỹ0-9]+|[^a-zA-ZÀ-ỹà-ỹ0-9\s]|\s+/gu) || []
    );
  }

  const highlightVans = (inputText: string) => {
    const tokens = tokenize(inputText);
    const vanColors = new Map<string, string>();
    const vanCounts = new Map<string, number>();
    const colors = [
      "bg-yellow-400",
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-400",
      "bg-red-500",
      "bg-cyan-400",
      "bg-lime-400",
      "bg-fuchsia-500",
      "bg-amber-400",
      "bg-violet-500",
    ];
    let colorIndex = 0;

    // Đếm số lần xuất hiện của mỗi vần
    tokens.forEach((token) => {
      if (/^[a-zA-ZÀ-ỹà-ỹ0-9]+$/.test(token)) {
        const van = getVan(token);
        vanCounts.set(van, (vanCounts.get(van) || 0) + 1);
      }
    });

    const html = tokens
      .map((token) => {
        if (token === "\n") return "<br/>";
        if (/^\s+$/.test(token)) return token.replace(/ /g, "&nbsp;");
        if (/^[a-zA-ZÀ-ỹà-ỹ0-9]+$/.test(token)) {
          const van = getVan(token);
          // Chỉ tô màu nếu vần xuất hiện từ 2 lần trở lên
          if (vanCounts.get(van)! >= 2) {
            if (!vanColors.has(van)) {
              vanColors.set(van, colors[colorIndex % colors.length]);
              colorIndex++;
            }
            const color = vanColors.get(van);
            return `<span class='${color} rhyme-word' style='
              padding:2px 10px;
              border-radius:8px;
              color:#fff;
              font-weight:bold;
              text-transform:uppercase;
              margin:2px 3px;
              border:2.5px solid #222;
              box-shadow:0 2px 8px rgba(0,0,0,0.13);
              letter-spacing:1px;
              font-size:1.1em;
              transition:transform 0.1s,border-color 0.1s;
              display:inline-block;
            '>${token}</span>`;
          } else {
            return token;
          }
        }
        return token;
      })
      .join("");
    setHighlightedText(html);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Easy Vần
        </h1>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Nhập văn bản để kiểm tra vần</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Nhập văn bản của bạn vào đây..."
                value={text}
                onChange={handleTextChange}
                className="min-h-[200px]"
              />
              <Button onClick={() => highlightVans(text)} className="w-full">
                Kiểm tra vần
              </Button>

              {highlightedText && (
                <div className="mt-4 p-4 border rounded-lg bg-white">
                  <h3 className="text-lg font-semibold mb-2">Kết quả:</h3>
                  <div
                    className="prose max-w-none whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: highlightedText }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
