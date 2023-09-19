import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(["footer"]);
  return (
    <div className="text-[rgb(115,115,115)] flex-col gap-5">
      <div className="flex flex-wrap text-[rgb(115,115,115)] gap-2 justify-center text-center">
        <p>Meta</p>
        <p>{t("About_ft")}</p>
        <p>Blog</p>
        <p>{t("Jobs_ft")}</p>
        <p>{t("Help_ft")}</p>
        <p>API</p>
        <p>{t("Privacy_ft")}</p>
        <p>{t("Terms_ft")}</p>
        <p>{t("Top_Accounts_ft")}</p>
        <p>{t("Locations_ft")}</p>
        <p>Instagram Lite</p>
        <p>Threads</p>
        <p>{t("Contact_Uploading_ft")}</p>
        <p>{t("Meta_Verified_ft")}</p>
      </div>
      <div className="flex flex-wrap text-[rgb(115,115,115)] gap-2 justify-center text-center mt-5">
        <p>{t("English_ft")}</p>
        <p>© 2023 Instagram from Meta</p>
      </div>
    </div>
  );
};

export default Footer;
