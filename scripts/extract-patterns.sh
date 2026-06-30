#!/usr/bin/env bash
set -euo pipefail

PDF_PATH="${HANFU_PDF:-/home/mr-kechen/BigData/hanfu/现代汉服裁剪参照图集.pdf}"
OUTPUT_DIR="${HANFU_OUTPUT:-public/images/patterns}"
RESOLUTION=150
WIDTH=1000

declare -A GARMENT_PAGES

# Chapter 1
GARMENT_PAGES["zhongyi"]="155-80a-views|12|155/80A 外观图|155-80a-dimensions|13|155/80A 详细尺寸图|160-84a-views|14|160/84A 外观图|160-84a-dimensions|15|160/84A 详细尺寸图|165-88a-views|16|165/88A 外观图|165-88a-dimensions|17|165/88A 详细尺寸图|170-92a-views|18|170/92A 外观图|170-92a-dimensions|19|170/92A 详细尺寸图|175-96a-views|20|175/96A 外观图|175-96a-dimensions|21|175/96A 详细尺寸图|180-100a-views|22|180/100A 外观图|180-100a-dimensions|23|180/100A 详细尺寸图"
GARMENT_PAGES["kuzi"]="155-68a-views|24|155/68A 外观图|155-68a-dimensions|25|155/68A 详细尺寸图|160-72a-views|26|160/72A 外观图|160-72a-dimensions|27|160/72A 详细尺寸图|165-76a-views|28|165/76A 外观图|165-76a-dimensions|29|165/76A 详细尺寸图|170-80a-views|30|170/80A 外观图|170-80a-dimensions|31|170/80A 详细尺寸图|175-84a-views|32|175/84A 外观图"

# Chapter 2
GARMENT_PAGES["duan-ao"]="size-table|34|尺码表|155-80a-views|35|155/80A 外观图|155-80a-dimensions|36|155/80A 详细尺寸图|160-84a-views|37|160/84A 外观图|160-84a-dimensions|38|160/84A 详细尺寸图|165-88a-views|39|165/88A 外观图|165-88a-dimensions|40|165/88A 详细尺寸图|170-92a-views|41|170/92A 外观图|170-92a-dimensions|42|170/92A 详细尺寸图"
GARMENT_PAGES["da-ao"]="size-table|44|尺码表|155-80a-views|45|155/80A 外观图|155-80a-dimensions|46|155/80A 详细尺寸图|160-84a-views|47|160/84A 外观图|160-84a-dimensions|48|160/84A 详细尺寸图|165-88a-views|49|165/88A 外观图|165-88a-dimensions|50|165/88A 详细尺寸图|170-92a-views|51|170/92A 外观图|170-92a-dimensions|52|170/92A 详细尺寸图"
GARMENT_PAGES["mamian-qun"]="size-table|54|尺码表|155-68a-views|55|155/68A 外观图|155-68a-dimensions|56|155/68A 详细尺寸图|160-72a-views|57|160/72A 外观图|160-72a-dimensions|58|160/72A 详细尺寸图|165-76a-views|59|165/76A 外观图|165-76a-dimensions|60|165/76A 详细尺寸图|170-80a-views|61|170/80A 外观图|170-80a-dimensions|62|170/80A 详细尺寸图"

# Chapter 3
GARMENT_PAGES["jiaoling-shang-ru"]="size-table|74|尺码表|155-80a-views|75|155/80A 外观图|155-80a-dimensions|76|155/80A 详细尺寸图|160-84a-views|77|160/84A 外观图|160-84a-dimensions|78|160/84A 详细尺寸图"
GARMENT_PAGES["duijin-shang-ru"]="size-table|84|尺码表|155-80a-views|85|155/80A 外观图|155-80a-dimensions|86|155/80A 详细尺寸图|160-84a-views|87|160/84A 外观图|160-84a-dimensions|88|160/84A 详细尺寸图|165-88a-views|89|165/88A 外观图|165-88a-dimensions|90|165/88A 详细尺寸图"
GARMENT_PAGES["zhe-qun"]="155-68a-a-views|94|155/68A A型 外观图|155-68a-a-dimensions|95|155/68A A型 详细尺寸图|160-72a-a-views|96|160/72A A型 外观图|160-72a-a-dimensions|97|160/72A A型 详细尺寸图|165-76a-b-views|98|165/76A B型 外观图|165-76a-b-dimensions|99|165/76A B型 详细尺寸图|170-80a-b-views|100|170/80A B型 外观图|170-80a-b-dimensions|101|170/80A B型 详细尺寸图|165-72a-b-views|102|165/72A B型 外观图|165-72a-b-dimensions|103|165/72A B型 详细尺寸图|165-72a-b2-views|104|165/72A B型 续"
GARMENT_PAGES["qixiong-ruqun"]="size-table|106|尺码表|shangru-155-80a-views|107|上襦 155/80A 外观图|shangru-155-80a-dimensions|108|上襦 155/80A 详细尺寸图|shangru-160-84a-views|109|上襦 160/84A 外观图|shangru-160-84a-dimensions|110|上襦 160/84A 详细尺寸图|shangru-165-88a-views|111|上襦 165/88A 外观图|shangru-165-88a-dimensions|112|上襦 165/88A 详细尺寸图|shangru-170-92a-views|113|上襦 170/92A 外观图|shangru-170-92a-dimensions|114|上襦 170/92A 详细尺寸图|qun-155-68a-views|115|裙 155/68A 外观图|qun-155-68a-dimensions|116|裙 155/68A 详细尺寸图|qun-160-72a-views|117|裙 160/72A 外观图|qun-160-72a-dimensions|118|裙 160/72A 详细尺寸图|qun-165-76a-views|119|裙 165/76A 外观图|qun-165-76a-dimensions|120|裙 165/76A 详细尺寸图"

# Chapter 4
GARMENT_PAGES["xieduijin-beizi"]="size-table|123|尺码表|155-80a-views|124|155/80A 外观图|155-80a-dimensions|125|155/80A 详细尺寸图|160-84a-views|126|160/84A 外观图|160-84a-dimensions|127|160/84A 详细尺寸图|165-88a-views|128|165/88A 外观图|165-88a-dimensions|129|165/88A 详细尺寸图|170-92a-views|130|170/92A 外观图|170-92a-dimensions|131|170/92A 详细尺寸图"
GARMENT_PAGES["zhiduijin-beizi"]="size-table|144|尺码表|155-80a-views|145|155/80A 外观图|155-80a-dimensions|146|155/80A 详细尺寸图|160-84a-views|147|160/84A 外观图|160-84a-dimensions|148|160/84A 详细尺寸图|165-88a-views|149|165/88A 外观图|165-88a-dimensions|150|165/88A 详细尺寸图|170-92a-views|151|170/92A 外观图|170-92a-dimensions|152|170/92A 详细尺寸图"

# Chapter 5
GARMENT_PAGES["panling-da-ao"]="size-table|164|尺码表|155-80a-views|165|155/80A 外观图|155-80a-dimensions|166|155/80A 详细尺寸图|160-84a-views|167|160/84A 外观图|160-84a-dimensions|168|160/84A 详细尺寸图|165-88a-views|169|165/88A 外观图|165-88a-dimensions|170|165/88A 详细尺寸图|170-92a-views|171|170/92A 外观图|170-92a-dimensions|172|170/92A 详细尺寸图"
GARMENT_PAGES["panling-duan-ao"]="size-table|184|尺码表|155-80a-views|185|155/80A 外观图|155-80a-dimensions|186|155/80A 详细尺寸图|160-84a-views|187|160/84A 外观图|160-84a-dimensions|188|160/84A 详细尺寸图|165-88a-views|189|165/88A 外观图|165-88a-dimensions|190|165/88A 详细尺寸图"

# Chapter 6
GARMENT_PAGES["quju"]="size-table|194|尺码表|155-80a-views|195|155/80A 外观图|155-80a-dimensions-1|196|155/80A 详细尺寸图 1|155-80a-dimensions-2|197|155/80A 详细尺寸图 2|160-84a-views|198|160/84A 外观图|160-84a-dimensions-1|199|160/84A 详细尺寸图 1|160-84a-dimensions-2|200|160/84A 详细尺寸图 2|165-88a-views|201|165/88A 外观图|165-88a-dimensions-1|202|165/88A 详细尺寸图 1|165-88a-dimensions-2|203|165/88A 详细尺寸图 2"

# Chapter 7
GARMENT_PAGES["jiaoling-banbi"]="size-table|217|尺码表|155-80a-views|218|155/80A 外观图|155-80a-dimensions|219|155/80A 详细尺寸图|160-84a-views|220|160/84A 外观图|160-84a-dimensions|221|160/84A 详细尺寸图|165-88a-views|222|165/88A 外观图|165-88a-dimensions|223|165/88A 详细尺寸图|170-92a-views|224|170/92A 外观图|170-92a-dimensions|225|170/92A 详细尺寸图"
GARMENT_PAGES["zhiduijin-banbi"]="size-table|231|尺码表|155-80a-views|232|155/80A 外观图|155-80a-dimensions|233|155/80A 详细尺寸图|160-84a-views|234|160/84A 外观图|160-84a-dimensions|235|160/84A 详细尺寸图|165-88a-views|236|165/88A 外观图|165-88a-dimensions|237|165/88A 详细尺寸图"
GARMENT_PAGES["xieduijin-banbi"]="size-table|241|尺码表|155-80a-views|242|155/80A 外观图|155-80a-dimensions|243|155/80A 详细尺寸图|160-84a-views|244|160/84A 外观图|160-84a-dimensions|245|160/84A 详细尺寸图|165-88a-views|246|165/88A 外观图|165-88a-dimensions|247|165/88A 详细尺寸图"

# Chapter 8
GARMENT_PAGES["shuhe"]="size-table|251|尺码表|165-88a-views|252|165/88A 外观图|165-88a-dimensions|253|165/88A 详细尺寸图|170-92a-views|254|170/92A 外观图|170-92a-dimensions|255|170/92A 详细尺寸图|175-96a-views|256|175/96A 外观图|175-96a-dimensions|257|175/96A 详细尺寸图|180-100a-views|258|180/100A 外观图|180-100a-dimensions|259|180/100A 详细尺寸图"

# Chapter 9
GARMENT_PAGES["zhiduo-zhishen"]="size-table|263|尺码表|165-88a-views|264|165/88A 外观图|165-88a-dimensions|265|165/88A 详细尺寸图|170-92a-views|266|170/92A 外观图|170-92a-dimensions|267|170/92A 详细尺寸图|175-96a-views|268|175/96A 外观图|175-96a-dimensions|269|175/96A 详细尺寸图|180-100a-views|270|180/100A 外观图|180-100a-dimensions|271|180/100A 详细尺寸图"
GARMENT_PAGES["daopao"]="size-table|288|尺码表|165-88a-views|289|165/88A 外观图|165-88a-dimensions|290|165/88A 详细尺寸图|170-92a-views|291|170/92A 外观图|170-92a-dimensions|292|170/92A 详细尺寸图|175-96a-views|293|175/96A 外观图|175-96a-dimensions|294|175/96A 详细尺寸图|180-100a-views|295|180/100A 外观图|180-100a-dimensions|296|180/100A 详细尺寸图"

# Chapter 10
GARMENT_PAGES["panling-pao"]="size-table|309|尺码表|165-88a-views|310|165/88A 外观图|165-88a-dimensions|311|165/88A 详细尺寸图|170-92a-views|312|170/92A 外观图|170-92a-dimensions|313|170/92A 详细尺寸图|175-96a-views|314|175/96A 外观图|175-96a-dimensions|315|175/96A 详细尺寸图|180-100a-views|316|180/100A 外观图|180-100a-dimensions|317|180/100A 详细尺寸图"
GARMENT_PAGES["lanshan"]="size-table|329|尺码表|165-88a-views|330|165/88A 外观图|165-88a-dimensions|331|165/88A 详细尺寸图|170-92a-views|332|170/92A 外观图|170-92a-dimensions|333|170/92A 详细尺寸图|175-96a-views|334|175/96A 外观图|175-96a-dimensions|335|175/96A 详细尺寸图|180-100a-views|336|180/100A 外观图|180-100a-dimensions|337|180/100A 详细尺寸图"

# Chapter 11
GARMENT_PAGES["shenyi"]="size-table|349|尺码表|155-80a-views|350|155/80A 外观图|155-80a-dimensions|351|155/80A 详细尺寸图|160-84a-views|352|160/84A 外观图|160-84a-dimensions|353|160/84A 详细尺寸图|165-88a-views|354|165/88A 外观图|165-88a-dimensions|355|165/88A 详细尺寸图|170-92a-views|356|170/92A 外观图|170-92a-dimensions|357|170/92A 详细尺寸图"

# Chapter 12
GARMENT_PAGES["yesa"]="size-table|368|尺码表|165-88a-views|369|165/88A 外观图|165-88a-dimensions|370|165/88A 详细尺寸图|170-92a-views|371|170/92A 外观图|170-92a-dimensions|372|170/92A 详细尺寸图|175-96a-views|373|175/96A 外观图|175-96a-dimensions|374|175/96A 详细尺寸图|180-100a-views|375|180/100A 外观图|180-100a-dimensions|376|180/100A 详细尺寸图"

declare -A GARMENT_NAMES
GARMENT_NAMES["zhongyi"]="中衣" GARMENT_NAMES["kuzi"]="裤子"
GARMENT_NAMES["duan-ao"]="短袄" GARMENT_NAMES["da-ao"]="大袄"
GARMENT_NAMES["mamian-qun"]="马面裙"
GARMENT_NAMES["jiaoling-shang-ru"]="交领上襦" GARMENT_NAMES["duijin-shang-ru"]="对襟上襦"
GARMENT_NAMES["zhe-qun"]="褶裙" GARMENT_NAMES["qixiong-ruqun"]="齐胸襦裙"
GARMENT_NAMES["xieduijin-beizi"]="斜对襟褙子" GARMENT_NAMES["zhiduijin-beizi"]="直对襟褙子"
GARMENT_NAMES["panling-da-ao"]="盘领大袄" GARMENT_NAMES["panling-duan-ao"]="盘领短袄"
GARMENT_NAMES["quju"]="曲裾"
GARMENT_NAMES["jiaoling-banbi"]="交领半臂" GARMENT_NAMES["zhiduijin-banbi"]="直对襟半臂" GARMENT_NAMES["xieduijin-banbi"]="斜对襟半臂"
GARMENT_NAMES["shuhe"]="裋褐"
GARMENT_NAMES["zhiduo-zhishen"]="直裰直身" GARMENT_NAMES["daopao"]="道袍"
GARMENT_NAMES["panling-pao"]="盘领袍" GARMENT_NAMES["lanshan"]="襕衫"
GARMENT_NAMES["shenyi"]="深衣" GARMENT_NAMES["yesa"]="曳撒"

if ! command -v mutool &>/dev/null; then
  echo "ERROR: mutool not found. Install mupdf-tools"
  exit 1
fi

if [ ! -f "$PDF_PATH" ]; then
  echo "ERROR: PDF not found at: $PDF_PATH"
  exit 1
fi

if [ "${1:-}" = "--list" ]; then
  echo "Available garments (${#GARMENT_PAGES[@]} total):"
  for id in "${!GARMENT_PAGES[@]}"; do
    name="${GARMENT_NAMES[$id]:-$id}"
    IFS='|' read -ra parts <<< "${GARMENT_PAGES[$id]}"
    count=$(( ${#parts[@]} / 3 ))
    echo "  $id  ($name, $count pages)"
  done
  exit 0
fi

extract_garment() {
  local garment_id="$1"
  local entry="${GARMENT_PAGES[$garment_id]:-}"
  local name="${GARMENT_NAMES[$garment_id]:-$garment_id}"
  if [ -z "$entry" ]; then echo "ERROR: Unknown garment ID: $garment_id"; return 1; fi
  local dir="$OUTPUT_DIR/$garment_id"
  mkdir -p "$dir"
  echo "Extracting: $name ($garment_id) -> $dir"
  IFS='|' read -ra parts <<< "$entry"
  local total=${#parts[@]}
  local extracted=0
  for ((i = 0; i < total; i += 3)); do
    local slug="${parts[$i]}"
    local page="${parts[$((i + 1))]}"
    local output="$dir/$slug.png"
    if [ -f "$output" ] && [ "${FORCE:-}" != "1" ]; then
      echo "  [SKIP] $slug.png"
      continue
    fi
    echo "  [P$page] $slug.png..."
    /usr/bin/mutool draw -o "$output" -r "$RESOLUTION" -w "$WIDTH" "$PDF_PATH" "$page" 2>/dev/null
    extracted=$((extracted + 1))
  done
  echo "  Done: $extracted files extracted"
}

if [ $# -eq 0 ]; then
  echo "Extracting ALL garments from PDF..."
  for id in "${!GARMENT_PAGES[@]}"; do extract_garment "$id"; done
  echo "All done!"
else
  for garment_id in "$@"; do extract_garment "$garment_id"; done
fi
