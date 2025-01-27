"use client";

import { useAtom } from "jotai";
import { pageAtom } from "@/stores/atoms";
import { userAtom } from "@/stores/user";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

const useGetPage = () => {
  const supabase = createClient();
  const [user] = useAtom(userAtom);
  const [page, setPage] = useAtom(pageAtom);

  const fetchPage = async (pageId: number) => {
    try {
      const userUid = user?.id;

      if (!userUid) {
        toast({
          variant: "destructive",
          title: "잘못된 접근입니다.",
          description: "본인이 작성한 일정만 확인할 수 있습니다.",
        });
        return;
      }

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .eq("user_uid", userUid);

      if (error) {
        toast({
          variant: "destructive",
          title: "페이지 조회 실패",
          description: "페이지 정보를 불러오지 못했습니다.",
        });
        return null;
      }

      const pageData = data?.[0] || null;
      const { id, title, start_date, end_date } = pageData;
      setPage({
        id,
        title,
        startDate: start_date,
        endDate: end_date,
      });

      return pageData;
    } catch (err) {
      console.error("Error in useGetPage:", err);
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요.",
      });
      return null;
    }
  };

  return { page, fetchPage };
};

export { useGetPage };
