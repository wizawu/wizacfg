import * as Database from "better-sqlite3"
import * as LoggerFactory from "log4js"
import nanoid58 from "nanoid-base58"

const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")

export const backendList: Backend[] = [
  { _id: 0, host: "127.0.0.1", port: 1080 },
  { _id: 1, host: "127.0.0.1", port: 1081 },
]

export const db = new Database("sqlite.db")
db.pragma("journal_mode=WAL")
db.pragma("wal_checkpoint=TRUNCATE")
db.exec("vacuum")

db.exec(`
    create table if not exists domain(
        domain text,
        prefer short,
        time long,
        primary key (domain)
    )
`)

db.exec(`
    create table if not exists history(
        history_id text,
        domain text,
        choose short,
        duration long,
        traffic long,
        error text,
        time long,
        primary key (history_id)
    )
`)

db.exec("create index if not exists history_idx_domain_traffic on history(domain, traffic)")
db.exec("create index if not exists history_idx_time on history(time)")

export function selectDomain(domain: string) {
  const start = Date.now()
  const result = db.prepare(`
        select * from domain where domain = @domain
    `).get({ domain })
  if (Date.now() - start > 1) log.warn("Slow query: " + (Date.now() - start) + "ms")
  return result
}

export function updateDomain(domain: string, prefer: number) {
  db.exec(`
        replace into domain(domain, prefer, time) values(
            '${domain}', ${prefer}, ${Date.now()}
        )
    `)
}

export function createHistory(domain: string, choose: number, duration: number, traffic: number, error?: string) {
  db.prepare(`
        replace into history(time, history_id, domain, choose, duration, traffic, error)
            values(
                ${Date.now()}, '${nanoid58(20)}', '${domain}',
                ${choose}, ${duration}, ${traffic},
                @error
            )
    `).run({ error: error || "" })
}

export function countConnErr(domain: string) {
  return db.prepare(`
        select
            sum(case when choose = 0 then 1 else 0 end) as error0,
            sum(case when choose = 1 then 1 else 0 end) as error1
        from history
        where domain = @domain and (traffic <= 26 or error = 'Connection timeout')
    `).get({ domain })
}

export function countReadErr(domain: string, prefer: number) {
  return db.prepare(`
        select
            sum(case when error = '' then 1 else 0 end) as ok,
            sum(case when error > '' then 1 else 0 end) as fail
        from history
        where domain = @domain and choose = @prefer and traffic > 26
    `).get({ domain, prefer })
}

export function trimHistory(days: number) {
  db.exec(`delete from history where time < ${Date.now() - days * 86400 * 1000}`)
}
