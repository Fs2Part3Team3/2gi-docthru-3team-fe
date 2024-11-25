import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import InputItem from "@/components/InputItem";
import TextareaItem from "@/components/TextareaItem";
import Dropdown from "@/components/Dropdown";
import CustomDatePicker from "@/components/CustomDatePicker";
import styles from "@/styles/new.module.css";

function updateChallenge() {
  const categories = ["Next.js", "API", "Career"];
  const doctypes = ["블로그", "공식문서"];

  const router = useRouter();

  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      name: "",
      link: "",
      category: "",
      doctype: "",
      deadline: null,
      personnel: "",
      description: "",
    },
  });

  const updateChallenge = async (id, data) => {
    try {
      const response = await axios.patch(`/api/challenges/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("챌린지 수정 실패:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    try {
      const challengeId = router.query.id;
      const result = await updateChallenge(challengeId, data);
      router.push(`/challenges/${result.id}`);
    } catch (error) {
      console.error("챌린지 수정 중 오류:", error);
    }
  };

  const allFields = watch();

  return (
    <div className={styles.Container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>챌린지 수정</h1>
        <div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputItem
                id="name"
                label="제목"
                placeholder="제목을 입력해주세요"
                {...field}
              />
            )}
          />

          <Controller
            name="link"
            control={control}
            render={({ field }) => (
              <InputItem
                id="link"
                label="원문 링크"
                placeholder="원문 링크를 입력해주세요"
                {...field}
              />
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="category"
                label="카테고리"
                options={categories}
                placeholder="카테고리"
                {...field}
              />
            )}
          />

          <Controller
            name="doctype"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="doctype"
                label="문서 타입"
                options={doctypes}
                placeholder="문서 타입"
                {...field}
              />
            )}
          />

          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <CustomDatePicker
                id="deadline"
                label="마감일"
                placeholder="YYYY/MM/DD"
                {...field}
              />
            )}
          />

          <Controller
            name="personnel"
            control={control}
            render={({ field }) => (
              <InputItem
                id="personnel"
                label="최대 인원"
                placeholder="인원을 입력해주세요"
                {...field}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextareaItem
                id="description"
                label="내용"
                placeholder="내용을 입력해주세요"
                {...field}
              />
            )}
          />
        </div>
        <button
          className={styles.button}
          type="submit"
          disabled={
            !allFields.name ||
            !allFields.link ||
            !allFields.category ||
            !allFields.doctype ||
            !allFields.deadline ||
            !allFields.personnel ||
            !allFields.description
          }
        >
          수정하기
        </button>
      </form>
    </div>
  );
}

export default updateChallenge;