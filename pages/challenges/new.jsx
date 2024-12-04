import React from "react";
import { useForm, Controller } from "react-hook-form";
import InputItem from "@/components/InputItem";
import TextareaItem from "@/components/TextareaItem";
import Dropdown from "@/components/Dropdown";
import CustomDatePicker from "@/components/CustomDatePicker";
import styles from "@/styles/new.module.css"
import instance from "@/apis/instance";
import { useRouter } from "next/router"
import PopUp from "@/components/PopUp";
import useAuth from "@/hooks/useAuth";

function NewChallenge() {
  const router = useRouter();
  const { errorMessage, setErrorMessage } = useAuth();
  const fields = ["Next", "API", "Career", "Modern", "Web"];
  const doctypes = ["Blog", "Document"];

  const { handleSubmit, control, watch} = useForm({
    defaultValues: {
      title: "",
      docUrl: "",
      field: "",
      type: "",
      deadLine: null,
      maxParticipants: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("전송 데이터 확인:", data);
    try {
      const response = await instance.post("/challenges", data);
      console.log("챌린지 등록 성공:", response.data);
      router.push(`/challenges/${response.data.id}`);
    } catch (error) {
      console.error("챌린지 등록 실패:", error.response?.data || error.message);
      alert("에러 발생: " + (error.response?.data?.message || error.message));
    }
  };

  const allFields = watch();

  return (
    <div className={styles.Container}>
      {errorMessage && <PopUp onlyCancel={true} error={errorMessage} setError={setErrorMessage} />}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <h2>신규 챌린지 신청</h2>
          <div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <InputItem
                  id="title"
                  label="제목"
                  placeholder="제목을 입력해주세요"
                  {...field}
                />
              )}
            />

            <Controller
              name="docUrl"
              control={control}
              render={({ field }) => (
                <InputItem
                  id="docUrl"
                  label="원문 링크"
                  placeholder="원문 링크를 입력해주세요"
                  {...field}
                />
              )}
            />

            <Controller
              name="field"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="field"
                  label="카테고리"
                  options={fields}
                  placeholder="카테고리"
                  {...field}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Dropdown
                  id="type"
                  label="문서 타입"
                  options={doctypes}
                  placeholder="문서 타입"
                  {...field}
                />
              )}
            />

            <Controller
              name="deadLine"
              control={control}
              render={({ field }) => (
                <CustomDatePicker
                    id="deadLine"
                    label="마감일"
                    onChange={(date) => field.onChange(date)}
                    placeholder="YYYY/MM/DD"
                    {...field}
                />
              )}
            />

            <Controller
              name="maxParticipants"
              control={control}
              render={({ field }) => (
                <InputItem
                  id="maxParticipants"
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
              !allFields.title ||
              !allFields.docUrl ||
              !allFields.field ||
              !allFields.type ||
              !allFields.deadLine ||
              !allFields.maxParticipants ||
              !allFields.description
            }
          >
            신청하기
          </button>
        </form>
    </div>
  );
}

export default NewChallenge;