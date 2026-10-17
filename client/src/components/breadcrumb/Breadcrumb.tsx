import { Fragment } from "react";
import { Link } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import "./breadcrumb.css";

export type BreadcrumbItem = {
  label: string;
  count?: number;
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && <IconChevronRight size={16} stroke={2} className="chevron" />}

            {isLast ? (
              <div className="item" aria-current="page">
                <span className="label" >
                  {item.label}
                </span>
                {item.count !== undefined && (
                  <span className="count">{item.count}</span>
                )}
              </div>
            ) : (
              <Link className="item" to={item.to!}>
                <span className="label">{item.label}</span>
                {item.count !== undefined && (
                  <span className="count">{item.count}</span>
                )}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};