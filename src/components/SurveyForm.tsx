import React, { useState } from "react";
import "./SurveyForm.css";
import axios from "axios";

const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const chatIdVasya = import.meta.env.VITE_TELEGRAM_CHAT_ID_VASYA;
const chatIdPolina = import.meta.env.VITE_TELEGRAM_CHAT_ID_POLINA;

// Функция экранирования для MarkdownV2
const escapeMarkdownV2 = (text: string) => {
  return text
    .replace(/([_*[\]()~`>#+\-=|{}.^$\/?\\])/g, "\\$1") // Экранируем спецсимволы
    .trim(); // Убираем лишние пробелы и пустые строки
};

export const SurveyForm = () => {
  const [formData, setFormData] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
    question9: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    event.target.style.height = "auto"; // Сбрасываем высоту
    event.target.style.height = `${event.target.scrollHeight}px`; // Устанавливаем новую высоту

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Функция отправки данных в Telegram
  const sendMessageToTelegram = async (message: string, chatId: string) => {
    try {
      const escapedMessage = escapeMarkdownV2(message);

      const response = await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: chatId,
          text: escapedMessage,
          parse_mode: "MarkdownV2", // Используем MarkdownV2
        }
      );
      console.log(`Сообщение отправлено в чат ${chatId}:`, response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Ошибка от Telegram:", error.response?.data);
      } else {
        console.error("Ошибка при отправке запроса:", error);
      }
    }
  };

  // Обработка отправки формы
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formatText = (label: string, text: string) => {
      const cleanText = text.trim();
      return cleanText ? `*${label}*\n${escapeMarkdownV2(cleanText)}` : "";
    };

    const message = [
      formatText("Какие чувства ты сейчас испытываешь?", formData.question1),
      formatText("Что могло бы помочь тебе в этот момент?", formData.question2),
      formatText(
        "Как ты хочешь, чтобы я с тобой сейчас общался?",
        formData.question3
      ),
      formatText(
        "Что для тебя стало триггером в этой ситуации?",
        formData.question4
      ),
      formatText(
        "Что ты можешь сделать, чтобы успокоиться?",
        formData.question5
      ),
      formatText("Какую помощь ты ждешь от меня?", formData.question6),
      formatText("Как ты видишь мою реакцию?", formData.question7),
      formatText(
        "Есть ли что-то, что ты хочешь изменить в моем поведении?",
        formData.question8
      ),
      formatText(
        "Как бы ты хотела, чтобы я отреагировал на твою эмоцию?",
        formData.question9
      ),
    ]
      .filter(Boolean) // Убираем пустые строки
      .join("\n\n"); // Делаем четкий разрыв между блоками

    // Отправка сообщения в оба чата
    sendMessageToTelegram(message, chatIdVasya);
    sendMessageToTelegram(message, chatIdPolina);

    // Очистка формы после отправки
    setFormData({
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      question5: "",
      question6: "",
      question7: "",
      question8: "",
      question9: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="question1">
          Какие чувства ты сейчас испытываешь (гнев, печаль, тревога, радость)?
        </label>
        <textarea
          id="question1"
          name="question1"
          value={formData.question1}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="question2">
          Что могло бы помочь тебе в этот момент (успокоение, поддержка,
          пространство)?
        </label>
        <textarea
          id="question2"
          name="question2"
          value={formData.question2}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="question3">
          Как ты хочешь, чтобы я с тобой сейчас общался?
        </label>
        <textarea
          id="question3"
          name="question3"
          value={formData.question3}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="question4">
          Что для тебя стало триггером в этой ситуации?
        </label>
        <textarea
          id="question4"
          name="question4"
          value={formData.question4}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="question5">
          Что ты можешь сделать, чтобы успокоиться в момент сильных эмоций?
        </label>
        <textarea
          id="question5"
          name="question5"
          value={formData.question5}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="question6">
          Какую помощь ты ждешь от меня, чтобы справиться с текущими чувствами?
        </label>
        <textarea
          id="question6"
          name="question6"
          value={formData.question6}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="question7">Как ты видишь мою реакцию?</label>
        <textarea
          id="question7"
          name="question7"
          value={formData.question7}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="question8">
          Есть ли что-то, что ты хочешь изменить в том, как я веду себя сейчас?
        </label>
        <textarea
          id="question8"
          name="question8"
          value={formData.question8}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="question9">
          Как бы ты хотела, чтобы я отреагировал на твою эмоцию?
        </label>
        <textarea
          id="question9"
          name="question9"
          value={formData.question9}
          onChange={handleChange}
          rows={1}
        />
      </div>

      <button type="submit">Отправить</button>
    </form>
  );
};
